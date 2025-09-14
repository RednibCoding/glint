// Element represents a virtual DOM node that widgets render to
export class Element {
  constructor(tag, props = {}, children = []) {
    this.tag = tag;
    this.props = props;
    this.children = Array.isArray(children) ? children : [children];
    this.domNode = null;
    this.widget = null;
  }

  // Create actual DOM element from virtual element
  render() {
    if (typeof this.tag === 'string') {
      this.domNode = document.createElement(this.tag);
      
      // Apply props as attributes and event listeners
      Object.entries(this.props).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
          // Event listener
          const event = key.slice(2).toLowerCase();
          this.domNode.addEventListener(event, value);
        } else if (key === 'style' && typeof value === 'object') {
          // Style object
          Object.assign(this.domNode.style, value);
        } else if (key === 'className') {
          // CSS class
          if (value && value !== 'undefined') {
            this.domNode.className = value;
          }
        } else if (key === 'disabled') {
          // Boolean attribute
          if (value) {
            this.domNode.setAttribute('disabled', '');
          }
        } else {
          // Regular attribute
          this.domNode.setAttribute(key, value);
        }
      });

      // Render children
      this.children.forEach(child => {
        if (typeof child === 'string' || typeof child === 'number') {
          this.domNode.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Element) {
          this.domNode.appendChild(child.render());
        }
      });

      return this.domNode;
    }
  }

  // Update existing DOM element with new props/children
  update(newElement) {
    if (this.tag !== newElement.tag) {
      // Tag changed, need to replace entirely
      const newNode = newElement.render();
      this.domNode.parentNode.replaceChild(newNode, this.domNode);
      return newElement;
    }

    // Update props
    const oldProps = this.props;
    const newProps = newElement.props;
    
    // Remove old props
    Object.keys(oldProps).forEach(key => {
      if (!(key in newProps)) {
        if (key.startsWith('on')) {
          const event = key.slice(2).toLowerCase();
          this.domNode.removeEventListener(event, oldProps[key]);
        } else if (key === 'style') {
          this.domNode.style.cssText = '';
        } else {
          this.domNode.removeAttribute(key);
        }
      }
    });

    // Add/update new props - for event handlers, always re-attach
    Object.entries(newProps).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        // For event handlers, always remove old and add new
        if (oldProps[key]) {
          const event = key.slice(2).toLowerCase();
          this.domNode.removeEventListener(event, oldProps[key]);
        }
        const event = key.slice(2).toLowerCase();
        this.domNode.addEventListener(event, value);
      } else if (oldProps[key] !== value) {
        if (key === 'style' && typeof value === 'object') {
          Object.assign(this.domNode.style, value);
        } else if (key === 'className') {
          this.domNode.className = value;
        } else {
          this.domNode.setAttribute(key, value);
        }
      }
    });

    // Update children - simplified approach: replace all children
    // In a real framework, this would be more sophisticated with keyed updates
    while (this.domNode.firstChild) {
      this.domNode.removeChild(this.domNode.firstChild);
    }
    
    newElement.children.forEach(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        this.domNode.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof Element) {
        this.domNode.appendChild(child.render());
      }
    });

    this.props = newProps;
    this.children = newElement.children;
    newElement.domNode = this.domNode;
    
    return this;
  }
}
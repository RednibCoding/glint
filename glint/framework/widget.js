import { Element } from './element.js';

// Base Widget class - similar to Flutter's Widget
export class Widget {
  constructor(props = {}) {
    this.props = props;
    this.element = null;
    this.mounted = false;
  }

  // Abstract method - must be implemented by subclasses
  build() {
    throw new Error('build() method must be implemented');
  }

  // Render this widget to an element
  createElement() {
    const result = this.build();
    return this._convertToElement(result);
  }

  // Convert widget tree to element tree
  _convertToElement(item) {
    if (item instanceof Widget) {
      // Get the element from the widget's build method
      const result = item.build();
      // If build() returns another widget, convert it recursively
      if (result instanceof Widget) {
        return this._convertToElement(result);
      } else if (result instanceof Element) {
        // Convert any widget children to elements
        const convertedChildren = result.children.map(child => this._convertToElement(child));
        // Don't create a new Element, just update the children of the existing one
        result.children = convertedChildren;
        return result;
      } else {
        return result;
      }
    } else if (item instanceof Element) {
      // Convert any widget children to elements
      const convertedChildren = item.children.map(child => this._convertToElement(child));
      // Don't create a new Element, just update the children of the existing one
      item.children = convertedChildren;
      return item;
    } else {
      // Primitive value (string, number)
      return item;
    }
  }

  // Mount widget to DOM container
  mount(container) {
    this.element = this.createElement();
    const domNode = this.element.render();
    container.appendChild(domNode);
    this.mounted = true;
    return this;
  }

  // Update the widget with new props
  update(newWidget) {
    if (this.constructor !== newWidget.constructor) {
      // Widget type changed, need to replace
      const newElement = newWidget.createElement();
      const newNode = newElement.render();
      this.element.domNode.parentNode.replaceChild(newNode, this.element.domNode);
      return newWidget;
    }

    // Update props and re-build
    this.props = newWidget.props;
    const newElement = this.createElement();
    this.element = this.element.update(newElement);
    return this;
  }

  // Unmount widget from DOM
  unmount() {
    if (this.element && this.element.domNode) {
      this.element.domNode.remove();
    }
    this.mounted = false;
  }
}

// StatelessWidget - for widgets that don't have internal state
export class StatelessWidget extends Widget {
  constructor(props = {}) {
    super(props);
  }
}

// StatefulWidget - for widgets with internal state and lifecycle
export class StatefulWidget extends Widget {
  constructor(props = {}) {
    super(props);
    this.state = {};
    this._stateUpdaters = new Set();
  }

  // Update state and trigger re-render
  setState(newState) {
    const oldState = { ...this.state };
    
    if (typeof newState === 'function') {
      this.state = { ...this.state, ...newState(this.state) };
    } else {
      this.state = { ...this.state, ...newState };
    }

    // Only re-render if state actually changed
    if (JSON.stringify(oldState) !== JSON.stringify(this.state)) {
      this._triggerUpdate();
    }
  }

  // Internal method to trigger re-render
  _triggerUpdate() {
    if (this.mounted && this.element) {
      const newElement = this.createElement();
      this.element = this.element.update(newElement);
    }

    // Notify any parent widgets that are watching this state
    this._stateUpdaters.forEach(updater => updater());
  }

  // Allow parent widgets to watch for state changes
  _addStateUpdater(updater) {
    this._stateUpdaters.add(updater);
  }

  // Remove state updater
  _removeStateUpdater(updater) {
    this._stateUpdaters.delete(updater);
  }
}
/**
 * Glint Framework v2.0 - Clean Function Components
 */

// JSX helper
function jsx(strings, ...values) {
    let result = '';
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            const value = values[i];
            result += (value != null) ? String(value) : '';
        }
    }
    return result;
}

// Current component context
let currentComponent = null;
let stateIndex = 0;

// Hook to capture handlers automatically
function useHandlers(handlers) {
    if (window._glintHandlers) {
        Object.assign(window._glintHandlers, handlers);
    }
}

// useState hook
function useState(initialValue) {
    const component = currentComponent;
    const index = stateIndex++;
    
    if (!component._states) component._states = [];
    if (component._states[index] === undefined) {
        component._states[index] = initialValue;
    }
    
    const setState = (newValue) => {
        if (typeof newValue === 'function') {
            component._states[index] = newValue(component._states[index]);
        } else {
            component._states[index] = newValue;
        }
        component._render();
    };
    
    return [component._states[index], setState];
}

// Clean function component wrapper  
function createComponent(componentFunc, tagName) {
    return class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._states = [];
        }
        
        connectedCallback() {
            this._render();
        }
        
        attributeChangedCallback() {
            this._render();
        }
        
        static get observedAttributes() {
            // Observe all attributes for props
            return Array.from(document.querySelectorAll(tagName) || [])
                .flatMap(el => Array.from(el.attributes))
                .map(attr => attr.name)
                .filter((name, index, self) => self.indexOf(name) === index);
        }
        
        _getProps() {
            const props = {};
            Array.from(this.attributes).forEach(attr => {
                // Convert kebab-case to camelCase
                const propName = attr.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                props[propName] = attr.value;
            });
            return props;
        }
        
        _render() {
            currentComponent = this;
            stateIndex = 0;
            
            // Create a proxy to capture function declarations
            const handlers = {};
            const originalConsole = console.log;
            
            // Override console temporarily to capture handler assignments
            window._glintHandlers = handlers;
            
            const props = this._getProps();
            const html = componentFunc(props);
            this.shadowRoot.innerHTML = html;
            this._bindEvents(handlers);
            
            currentComponent = null;
        }
        
        _bindEvents(handlers) {
            this.shadowRoot.querySelectorAll('[onclick]').forEach(el => {
                const handlerName = el.getAttribute('onclick');
                el.removeAttribute('onclick');
                
                // Try to find handler from useHandlers or global scope
                const handler = handlers[handlerName] || window[handlerName];
                if (handler && typeof handler === 'function') {
                    el.onclick = handler;
                } else {
                    console.warn(`Handler '${handlerName}' not found`);
                }
            });
        }
    };
}

window.jsx = jsx;
window.useState = useState;
window.useHandlers = useHandlers;
window.createComponent = createComponent;



// Component: SimpleCounterComponent
// Clean Function Component
function SimpleCounter() {
    const [count, setCount] = useState(0);
    
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
    
    // Register handlers right after defining them
    useHandlers({ increment, decrement, reset });
    
    return jsx`
        <style>
            .counter {
                text-align: center;
                padding: 2rem;
                font-family: Arial, sans-serif;
            }
            
            .count-display {
                font-size: 3rem;
                font-weight: bold;
                color: #333;
                margin: 1rem 0;
            }
            
            .buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            button {
                padding: 0.75rem 1.5rem;
                font-size: 1rem;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .btn-increment {
                background-color: #10b981;
                color: white;
            }
            
            .btn-increment:hover {
                background-color: #059669;
            }
            
            .btn-decrement {
                background-color: #ef4444;
                color: white;
            }
            
            .btn-decrement:hover {
                background-color: #dc2626;
            }
            
            .btn-reset {
                background-color: #6b7280;
                color: white;
            }
            
            .btn-reset:hover {
                background-color: #4b5563;
            }
        </style>
        
        <div class="counter">
            <h2>Clean Counter</h2>
            <div class="count-display">${count}</div>
            <div class="buttons">
                <button class="btn-increment" onclick="increment">+</button>
                <button class="btn-decrement" onclick="decrement">-</button>
                <button class="btn-reset" onclick="reset">Reset</button>
            </div>
        </div>
    `;
}

// Auto-register as web component
customElements.define('simple-counter', createComponent(SimpleCounter, 'simple-counter'));



// Component: WelcomeMessageComponent
function WelcomeMessage(props) {
    const jsx = `
        <style>
            .welcome {
                padding: 20px;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                background: linear-gradient(135deg, #f0f8f0, #e8f5e8);
                font-family: Arial, sans-serif;
            }
            .name {
                color: #2E7D32;
                font-weight: bold;
                font-size: 1.2em;
            }
            .age {
                color: #666;
                font-style: italic;
            }
        </style>
        <div class="welcome">
            <h2>Welcome, <span class="name">${props.name || 'Anonymous'}</span>!</h2>
            ${props.age ? `<p class="age">Age: ${props.age}</p>` : ''}
            <p>Thanks for trying Glint v2.0!</p>
        </div>
    `;
    
    return jsx;
}

// Auto-register as web component
customElements.define('welcome-message', createComponent(WelcomeMessage, 'welcome-message'));

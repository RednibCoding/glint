/**
 * Glint Framework v2.0 - Clean Function Components
 */

// HTML tagged template literal (provides syntax highlighting)
function html(strings, ...values) {
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

// Legacy JSX helper (deprecated - use html`` instead)
function jsx(strings, ...values) {
    console.warn('jsx`` is deprecated. Use html`` for better syntax highlighting.');
    return html(strings, ...values);
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

window.html = html;
window.jsx = jsx;
window.useState = useState;
window.useHandlers = useHandlers;
window.createComponent = createComponent;



// Component: ConditionalExampleComponent
function ConditionalExample(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('guest');
    const [items, setItems] = useState(['Apple', 'Banana', 'Orange']);

    const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
    const changeRole = () => setUserRole(userRole === 'admin' ? 'user' : 'admin');

    useHandlers({ toggleLogin, changeRole });

    const jsx = html`
        <style>
            .container { padding: 20px; border: 1px solid #ccc; margin: 10px 0; }
            .admin { background: #ffe6e6; }
            .user { background: #e6f3ff; }
            .guest { background: #f0f0f0; }
            button { margin: 5px; padding: 8px 12px; }
            .item { padding: 5px; margin: 2px 0; background: #f9f9f9; }
        </style>
        
        <div class="container ${userRole}">
            <h3>Conditional Rendering Examples</h3>
            
            <!-- Simple if/else with ternary operator -->
            <div>
                <h4>Login Status:</h4>
                ${isLoggedIn ? html`
                    <p>✅ Welcome back!</p>
                    <button onclick="toggleLogin">Logout</button>
                ` : html`
                    <p>❌ Please log in</p>
                    <button onclick="toggleLogin">Login</button>
                `}
            </div>

            <!-- Conditional content with && operator -->
            <div>
                <h4>Admin Panel:</h4>
                ${isLoggedIn && userRole === 'admin' ? html`
                    <div style="background: #ffebe6; padding: 10px;">
                        <p>🔧 Admin controls available</p>
                        <button onclick="changeRole">Switch to User</button>
                    </div>
                ` : ''}
                
                ${isLoggedIn && userRole === 'user' ? html`
                    <div style="background: #e6f7ff; padding: 10px;">
                        <p>👤 User dashboard</p>
                        <button onclick="changeRole">Request Admin</button>
                    </div>
                ` : ''}
            </div>

            <!-- Multiple conditions -->
            <div>
                <h4>Status Message:</h4>
                <p>
                    ${!isLoggedIn ? 'Please log in to continue' : 
                      userRole === 'admin' ? '🔧 Administrator privileges' :
                      userRole === 'user' ? '👤 Standard user access' :
                      '👻 Unknown role'}
                </p>
            </div>

            <!-- Loop rendering -->
            <div>
                <h4>Items List:</h4>
                ${items.length > 0 ? html`
                    <div>
                        ${items.map(item => html`
                            <div class="item">📦 ${item}</div>
                        `).join('')}
                    </div>
                ` : html`
                    <p>No items available</p>
                `}
            </div>

            <!-- Loop with index -->
            <div>
                <h4>Numbered List:</h4>
                ${items.map((item, index) => html`
                    <div class="item">
                        ${index + 1}. ${item} ${index === 0 ? '(first!)' : ''}
                    </div>
                `).join('')}
            </div>

            <!-- Complex conditional with loops -->
            ${isLoggedIn ? html`
                <div>
                    <h4>Your Privileges:</h4>
                    ${['read', 'write', userRole === 'admin' ? 'delete' : null, userRole === 'admin' ? 'manage users' : null]
                        .filter(permission => permission !== null)
                        .map(permission => `
                            <div class="item">✓ ${permission}</div>
                        `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return jsx;
}

// Auto-register as web component
customElements.define('conditional-example', createComponent(ConditionalExample, 'conditional-example'));



// Component: SimpleCounterComponent
// Clean Function Component
function SimpleCounter() {
    const [count, setCount] = useState(0);
    
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
    
    // Register handlers right after defining them
    useHandlers({ increment, decrement, reset });
    
    return html`
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
    const jsx = html`
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

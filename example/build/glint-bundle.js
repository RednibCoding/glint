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

// Named stores for state management
const namedStores = new Map();

function createStore(name, initialState = {}, actions = {}) {
    if (!namedStores.has(name)) {
        const store = {
            state: initialState,
            actions: {},
            subscribers: new Set(),
            
            getState() {
                return this.state;
            },
            
            setState(updates) {
                if (typeof updates === 'function') {
                    this.state = { ...this.state, ...updates(this.state) };
                } else {
                    this.state = { ...this.state, ...updates };
                }
                this.notifySubscribers();
            },
            
            setActions(actions) {
                // Bind actions with get/set helpers
                Object.keys(actions).forEach(key => {
                    this.actions[key] = (...args) => {
                        const get = () => this.getState();
                        const set = (updates) => this.setState(updates);
                        return actions[key](get, set, ...args);
                    };
                });
            },
            
            notifySubscribers() {
                this.subscribers.forEach(callback => callback());
            },
            
            subscribe(callback) {
                this.subscribers.add(callback);
                return () => this.subscribers.delete(callback);
            }
        };
        
        store.setActions(actions);
        namedStores.set(name, store);
    }
    
    return namedStores.get(name);
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

// Named store hook - useStore('storeName', initialState, actions) 
function useStore(storeName, initialState = {}, actions = {}) {
    const component = currentComponent;
    
    if (typeof storeName !== 'string') {
        throw new Error('useStore requires a store name as the first parameter: useStore("storeName", initialState, actions)');
    }
    
    const store = createStore(storeName, initialState, actions);
    
    // Subscribe component to this specific store
    const subscriptionKey = '_' + storeName + 'Subscribed';
    const unsubscribeKey = '_' + storeName + 'Unsubscribe';
    
    if (component && !component[subscriptionKey]) {
        component[subscriptionKey] = true;
        component[unsubscribeKey] = store.subscribe(() => component._render());
    }
    
    return [store.getState(), store.actions];
}

// Local component state hook
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
        
        disconnectedCallback() {
            // Cleanup all store subscriptions to prevent memory leaks
            Object.keys(this).forEach(key => {
                if (key.endsWith('Unsubscribe') && typeof this[key] === 'function') {
                    this[key]();
                    this[key] = null;
                }
            });
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
window.useStore = useStore;
window.useHandlers = useHandlers;
window.createComponent = createComponent;


// Counter Store - manages global counter state
const counterStore = createStore('counter', 
    { 
        count: 0,
        step: 1 
    }, 
    {
        increment: (get, set) => {
            set({ count: get().count + get().step });
        },
        decrement: (get, set) => {
            set({ count: get().count - get().step });
        },
        reset: (get, set) => {
            set({ count: 0 });
        },
        setStep: (get, set, newStep) => {
            set({ step: newStep });
        }
    }
);

// Theme Store - manages application theme and UI preferences
const themeStore = createStore('theme',
    {
        theme: 'light',
        primaryColor: '#007acc',
        fontSize: 'medium'
    },
    {
        toggleTheme: (get, set) => {
            set({ theme: get().theme === 'light' ? 'dark' : 'light' });
        },
        setPrimaryColor: (get, set, color) => {
            set({ primaryColor: color });
        },
        setFontSize: (get, set, size) => {
            set({ fontSize: size });
        },
        applyPreset: (get, set, preset) => {
            const presets = {
                default: { theme: 'light', primaryColor: '#007acc', fontSize: 'medium' },
                dark: { theme: 'dark', primaryColor: '#ffa500', fontSize: 'medium' },
                accessible: { theme: 'light', primaryColor: '#2b5797', fontSize: 'large' }
            };
            if (presets[preset]) {
                set(presets[preset]);
            }
        }
    }
);

// User Store - manages user authentication and profile
const userStore = createStore('user',
    {
        currentUser: null,
        isLoggedIn: false,
        preferences: {}
    },
    {
        login: (get, set, username) => {
            set({ 
                currentUser: { name: username, loginTime: new Date() },
                isLoggedIn: true 
            });
        },
        logout: (get, set) => {
            set({ 
                currentUser: null,
                isLoggedIn: false,
                preferences: {}
            });
        },
        updatePreferences: (get, set, newPrefs) => {
            set({ 
                preferences: { ...get().preferences, ...newPrefs }
            });
        }
    }
);


// Component: BetterStoreExampleComponent
// Better approach: Named stores/slices
function BetterGlobalExample() {
    // You could have multiple named stores like this:
    
    // Counter store
    const [counterState, counterActions] = useStore('counter',
        { count: 0 },
        {
            increment: () => updateStore('counter', state => ({ 
                count: state.count + 1 
            })),
            decrement: () => updateStore('counter', state => ({ 
                count: state.count - 1 
            }))
        }
    );
    
    // Theme store  
    const [themeState, themeActions] = useStore('theme',
        { theme: 'light', primaryColor: '#007acc' },
        {
            toggleTheme: () => updateStore('theme', state => ({ 
                theme: state.theme === 'light' ? 'dark' : 'light' 
            })),
            setPrimaryColor: (color) => updateStore('theme', { primaryColor: color })
        }
    );
    
    useHandlers({
        increment: counterActions.increment,
        decrement: counterActions.decrement,
        toggleTheme: themeActions.toggleTheme
    });
    
    return html`
        <div>
            <h3>Named Stores Example</h3>
            <p>Counter: ${counterState.count}</p>
            <p>Theme: ${themeState.theme}</p>
            <button onclick="increment">+</button>
            <button onclick="decrement">-</button>
            <button onclick="toggleTheme">Toggle Theme</button>
        </div>
    `;
}

// Auto-register as web component
customElements.define('better-store-example', createComponent(BetterGlobalExample, 'better-store-example'));



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



// Component: NamedStoresDemoComponent
function NamedStoresDemo() {
    // Use multiple named stores
    const [counterState, counterActions] = useStore('counter');
    const [themeState, themeActions] = useStore('theme');  
    const [userState, userActions] = useStore('user');
    
    // Local state for demo
    const [localMessage, setLocalMessage] = useState('Hello from local state!');
    
    useHandlers({
        // Counter actions
        increment: counterActions.increment,
        decrement: counterActions.decrement,
        reset: counterActions.reset,
        
        // Theme actions  
        toggleTheme: themeActions.toggleTheme,
        setBlueTheme: () => themeActions.setPrimaryColor('#007acc'),
        setGreenTheme: () => themeActions.setPrimaryColor('#28a745'),
        applyDarkPreset: () => themeActions.applyPreset('dark'),
        applyAccessiblePreset: () => themeActions.applyPreset('accessible'),
        
        // User actions
        loginAlice: () => userActions.login('Alice'),
        loginBob: () => userActions.login('Bob'), 
        logout: userActions.logout,
        
        // Local action
        updateMessage: () => setLocalMessage('Updated at ' + new Date().toLocaleTimeString())
    });

    return html`
        <style>
            .named-stores-demo {
                padding: 20px;
                border-radius: 8px;
                margin: 10px 0;
                transition: all 0.3s ease;
                background: ${themeState.theme === 'dark' ? '#2d2d2d' : '#f8f9fa'};
                color: ${themeState.theme === 'dark' ? 'white' : '#333'};
                border: 2px solid ${themeState.primaryColor};
                font-size: ${themeState.fontSize === 'large' ? '1.1em' : '1em'};
            }
            
            .store-section {
                margin: 15px 0;
                padding: 15px;
                border-left: 4px solid ${themeState.primaryColor};
                background: ${themeState.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                border-radius: 4px;
            }
            
            .state-display {
                font-family: monospace;
                background: ${themeState.theme === 'dark' ? '#1a1a1a' : '#fff'};
                padding: 10px;
                border-radius: 4px;
                margin: 10px 0;
                border: 1px solid ${themeState.primaryColor}30;
            }
            
            button {
                margin: 4px;
                padding: 8px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                background: ${themeState.primaryColor};
                color: white;
                transition: opacity 0.2s;
            }
            
            button:hover {
                opacity: 0.8;
            }
            
            .secondary-btn {
                background: #6c757d;
            }
            
            .success-btn {
                background: #28a745;
            }
            
            .danger-btn {
                background: #dc3545;
            }
        </style>
        
        <div class="named-stores-demo">
            <h3>🏪 Named Stores Demo</h3>
            <p><em>Each store is independent and can be used by multiple components</em></p>
            
            <div class="store-section">
                <h4>📊 Counter Store</h4>
                <div class="state-display">
                    Count: ${counterState.count} | Step: ${counterState.step}
                </div>
                <button onclick="increment">+${counterState.step}</button>
                <button onclick="decrement">-${counterState.step}</button>
                <button class="secondary-btn" onclick="reset">Reset</button>
            </div>
            
            <div class="store-section">
                <h4>🎨 Theme Store</h4>
                <div class="state-display">
                    Theme: ${themeState.theme} | Color: ${themeState.primaryColor} | Font: ${themeState.fontSize}
                </div>
                <button onclick="toggleTheme">Toggle Theme</button>
                <button onclick="setBlueTheme" style="background: #007acc;">Blue</button>
                <button onclick="setGreenTheme" style="background: #28a745;">Green</button>
                <button class="secondary-btn" onclick="applyDarkPreset">Dark Preset</button>
                <button class="secondary-btn" onclick="applyAccessiblePreset">Accessible</button>
            </div>
            
            <div class="store-section">
                <h4>👤 User Store</h4>
                <div class="state-display">
                    ${userState.isLoggedIn ? html`
                        User: ${userState.currentUser.name}<br>
                        Logged in: ${new Date(userState.currentUser.loginTime).toLocaleTimeString()}
                    ` : 'Not logged in'}
                </div>
                ${!userState.isLoggedIn ? html`
                    <button class="success-btn" onclick="loginAlice">Login as Alice</button>
                    <button class="success-btn" onclick="loginBob">Login as Bob</button>
                ` : html`
                    <span>Welcome, ${userState.currentUser.name}!</span>
                    <button class="danger-btn" onclick="logout">Logout</button>
                `}
            </div>
            
            <div class="store-section">
                <h4>🏠 Local State</h4>
                <div class="state-display">
                    Message: "${localMessage}"
                </div>
                <button class="secondary-btn" onclick="updateMessage">Update Local Message</button>
            </div>
            
            <div class="store-section">
                <h4>💡 Benefits</h4>
                <ul>
                    <li><strong>Separation of concerns:</strong> Each store handles one domain</li>
                    <li><strong>Reusable:</strong> Multiple components can use the same stores</li>
                    <li><strong>Automatic cleanup:</strong> Subscriptions cleaned up on unmount</li>
                    <li><strong>Type safety:</strong> Clear action signatures with get/set helpers</li>
                    <li><strong>File organization:</strong> Stores in separate .store.js files</li>
                </ul>
            </div>
        </div>
    `;
}

// Auto-register as web component
customElements.define('named-stores-demo', createComponent(NamedStoresDemo, 'named-stores-demo'));



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

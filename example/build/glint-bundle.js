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
    if (!window._glintHandlers) {
        window._glintHandlers = {};
    }
    Object.assign(window._glintHandlers, handlers);
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
            
            // Initialize handlers object for this component
            window._glintHandlers = {};
            
            const props = this._getProps();
            const html = componentFunc(props);
            this.shadowRoot.innerHTML = html;
            this._bindEvents(window._glintHandlers || {});
            
            currentComponent = null;
        }
        
        _bindEvents(handlers) {
            // Define all supported events
            const eventTypes = [
                // Mouse Events
                'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 
                'onmouseout', 'onmousemove', 'onmouseenter', 'onmouseleave',
                
                // Form Events
                'onchange', 'oninput', 'onsubmit', 'onfocus', 'onblur', 'onselect',
                'onreset', 'oninvalid',
                
                // Keyboard Events
                'onkeydown', 'onkeyup', 'onkeypress',
                
                // Touch Events (for mobile)
                'ontouchstart', 'ontouchend', 'ontouchmove', 'ontouchcancel',
                
                // Drag Events
                'ondragstart', 'ondrag', 'ondragenter', 'ondragover', 
                'ondragleave', 'ondrop', 'ondragend',
                
                // Media Events
                'onloadstart', 'onloadeddata', 'onloadedmetadata', 'oncanplay',
                'oncanplaythrough', 'onplay', 'onpause', 'onended', 'onvolumechange',
                
                // Window/Document Events
                'onload', 'onerror', 'onresize', 'onscroll', 'onunload',
                
                // Other useful events
                'oncontextmenu', 'onwheel', 'onanimationstart', 'onanimationend',
                'ontransitionstart', 'ontransitionend'
            ];
            
            // Bind all event types
            eventTypes.forEach(eventType => {
                const eventName = eventType.substring(2); // Remove 'on' prefix
                const selector = '[' + eventType + ']';
                
                this.shadowRoot.querySelectorAll(selector).forEach(el => {
                    const handlerName = el.getAttribute(eventType);
                    el.removeAttribute(eventType);
                    
                    // Try to find handler from useHandlers or global scope
                    const handler = handlers[handlerName] || 
                                   window[handlerName] || 
                                   (window._glintHandlers && window._glintHandlers[handlerName]);
                    
                    if (handler && typeof handler === 'function') {
                        el.addEventListener(eventName, handler);
                    } else {
                        console.warn(eventType + ' handler "' + handlerName + '" not found');
                    }
                });
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


// Utility: src/utils/common-utils.js
// String utility functions
const StringUtils = {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    
    toCamelCase: (str) => {
        return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    },
    
    toKebabCase: (str) => {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    },
    
    truncate: (str, length = 50) => {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },
    
    wordCount: (str) => {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
};

// Date utilities
const DateUtils = {
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    timeAgo: (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    },
    
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
};

// Color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

// Utility: src/utils/math-utils.js
// Math utility functions
const MathUtils = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b,
    square: (n) => n * n,
    factorial: (n) => {
        if (n <= 1) return 1;
        return n * MathUtils.factorial(n - 1);
    },
    formatNumber: (num) => {
        return new Intl.NumberFormat().format(num);
    }
};

// Also export individual functions for convenience
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

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



// Component: ComprehensiveUtilsDemoComponent
function ComprehensiveUtilsDemo() {
    const [text, setText] = useState('Hello World This is a Test');
    const [color, setColor] = useState('#3498db');
    const [testDate] = useState(new Date(2024, 8, 1)); // Sept 1, 2024
    const [mathA, setMathA] = useState(5);
    const [mathB, setMathB] = useState(3);

    useHandlers({
        updateText: (e) => setText(e.target.value),
        updateColor: (e) => setColor(e.target.value),
        updateMathA: (e) => setMathA(parseInt(e.target.value) || 0),
        updateMathB: (e) => setMathB(parseInt(e.target.value) || 0),
        randomizeAll: () => {
            setText(randomWords());
            setColor(randomHexColor());
            setMathA(randomBetween(1, 20));
            setMathB(randomBetween(1, 20));
        }
    });

    // Helper functions using our utilities
    const randomWords = () => {
        const words = ['Amazing', 'Fantastic', 'Incredible', 'Wonderful', 'Brilliant', 'Awesome'];
        const count = randomBetween(2, 4);
        const selected = [];
        for (let i = 0; i < count; i++) {
            selected.push(words[randomBetween(0, words.length - 1)]);
        }
        return selected.join(' ');
    };

    const randomHexColor = () => {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#34495e'];
        return colors[randomBetween(0, colors.length - 1)];
    };

    // Get color RGB values
    const rgb = hexToRgb(color);
    const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid';

    return html`
        <style>
            .comprehensive-demo {
                padding: 25px;
                border: 2px solid ${color};
                border-radius: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, ${color}22, ${color}11);
            }
            
            .demo-section {
                margin-bottom: 25px;
                padding: 15px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .demo-section h4 {
                margin: 0 0 15px 0;
                color: ${color};
                border-bottom: 2px solid ${color};
                padding-bottom: 8px;
            }
            
            .controls {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .controls label {
                display: flex;
                flex-direction: column;
                gap: 5px;
                min-width: 120px;
            }
            
            .controls input {
                padding: 8px;
                border: 2px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .controls input:focus {
                border-color: ${color};
                outline: none;
            }
            
            .result-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .result-item {
                padding: 10px;
                background: ${color}11;
                border: 1px solid ${color}44;
                border-radius: 6px;
            }
            
            .result-item strong {
                color: ${color};
            }
            
            .main-button {
                background: ${color};
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .main-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px ${color}44;
            }
            
            .color-preview {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${color};
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
        </style>
        
        <div class="comprehensive-demo">
            <h3>🛠️ Comprehensive Utilities Demo</h3>
            <p>This demonstrates how multiple utility files work together in Glint components.</p>
            
            <div class="controls">
                <button class="main-button" onclick="randomizeAll">🎲 Randomize Everything</button>
            </div>
            
            <div class="demo-section">
                <h4>📝 String Utilities (StringUtils)</h4>
                <div class="controls">
                    <label>
                        Text Input:
                        <input type="text" value="${text}" onchange="updateText" />
                    </label>
                </div>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Original:</strong><br>
                        "${text}"
                    </div>
                    <div class="result-item">
                        <strong>Capitalized:</strong><br>
                        "${StringUtils.capitalize(text.toLowerCase())}"
                    </div>
                    <div class="result-item">
                        <strong>Camel Case:</strong><br>
                        "${StringUtils.toCamelCase(text)}"
                    </div>
                    <div class="result-item">
                        <strong>Kebab Case:</strong><br>
                        "${StringUtils.toKebabCase(text)}"
                    </div>
                    <div class="result-item">
                        <strong>Truncated:</strong><br>
                        "${StringUtils.truncate(text, 15)}"
                    </div>
                    <div class="result-item">
                        <strong>Word Count:</strong><br>
                        ${StringUtils.wordCount(text)} words
                    </div>
                </div>
            </div>
            
            <div class="demo-section">
                <h4>🎨 Color Utilities (Individual Functions)</h4>
                <div class="controls">
                    <label>
                        Color:
                        <input type="color" value="${color}" onchange="updateColor" />
                    </label>
                    <div class="color-preview"></div>
                </div>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Hex:</strong><br>
                        ${color}
                    </div>
                    <div class="result-item">
                        <strong>RGB:</strong><br>
                        ${rgbString}
                    </div>
                    <div class="result-item">
                        <strong>RGB Object:</strong><br>
                        ${rgb ? `r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}` : 'Invalid'}
                    </div>
                    <div class="result-item">
                        <strong>Back to Hex:</strong><br>
                        ${rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : 'N/A'}
                    </div>
                </div>
            </div>
            
            <div class="demo-section">
                <h4>📅 Date Utilities (DateUtils)</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Test Date:</strong><br>
                        ${DateUtils.formatDate(testDate)}
                    </div>
                    <div class="result-item">
                        <strong>Time Ago:</strong><br>
                        ${DateUtils.timeAgo(testDate)}
                    </div>
                    <div class="result-item">
                        <strong>+30 Days:</strong><br>
                        ${DateUtils.formatDate(DateUtils.addDays(testDate, 30))}
                    </div>
                    <div class="result-item">
                        <strong>Current Date:</strong><br>
                        ${DateUtils.formatDate(new Date())}
                    </div>
                </div>
            </div>
            
            <div class="demo-section">
                <h4>🔢 Math Utilities (MathUtils)</h4>
                <div class="controls">
                    <label>
                        Number A:
                        <input type="number" value="${mathA}" onchange="updateMathA" />
                    </label>
                    <label>
                        Number B:
                        <input type="number" value="${mathB}" onchange="updateMathB" />
                    </label>
                </div>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Add:</strong><br>
                        ${MathUtils.formatNumber(MathUtils.add(mathA, mathB))}
                    </div>
                    <div class="result-item">
                        <strong>Multiply:</strong><br>
                        ${MathUtils.formatNumber(MathUtils.multiply(mathA, mathB))}
                    </div>
                    <div class="result-item">
                        <strong>Square A:</strong><br>
                        ${MathUtils.formatNumber(MathUtils.square(mathA))}
                    </div>
                    <div class="result-item">
                        <strong>Factorial A:</strong><br>
                        ${mathA <= 10 ? MathUtils.formatNumber(MathUtils.factorial(mathA)) : 'Too large!'}
                    </div>
                    <div class="result-item">
                        <strong>Random (1-100):</strong><br>
                        ${MathUtils.formatNumber(randomBetween(1, 100))}
                    </div>
                    <div class="result-item">
                        <strong>Currency Format:</strong><br>
                        ${formatCurrency(MathUtils.multiply(mathA, mathB))}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Auto-register as web component
customElements.define('comprehensive-utils-demo', createComponent(ComprehensiveUtilsDemo, 'comprehensive-utils-demo'));



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



// Component: EventsDemoComponent
function EventsDemo() {
    const [logs, setLogs] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [dragText, setDragText] = useState('Drag me around!');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [keyPressed, setKeyPressed] = useState('');
    const [focusState, setFocusState] = useState('');

    const addLog = (eventType, detail = '') => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = `[${timestamp}] ${eventType}${detail ? ': ' + detail : ''}`;
        setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10 logs
    };

    useHandlers({
        // Mouse Events
        handleClick: () => addLog('Click'),
        handleDoubleClick: () => addLog('Double Click'),
        handleMouseDown: () => addLog('Mouse Down'),
        handleMouseUp: () => addLog('Mouse Up'),
        handleMouseOver: () => addLog('Mouse Over'),
        handleMouseOut: () => addLog('Mouse Out'),
        handleMouseMove: (e) => {
            setMousePos({ x: e.offsetX, y: e.offsetY });
            addLog('Mouse Move', `x:${e.offsetX}, y:${e.offsetY}`);
        },
        handleMouseEnter: () => addLog('Mouse Enter'),
        handleMouseLeave: () => addLog('Mouse Leave'),

        // Form Events
        handleChange: (e) => {
            setInputValue(e.target.value);
            addLog('Change', e.target.value);
        },
        handleInput: (e) => addLog('Input', e.target.value),
        handleFocus: (e) => {
            setFocusState('focused');
            addLog('Focus', e.target.tagName);
        },
        handleBlur: (e) => {
            setFocusState('blurred');
            addLog('Blur', e.target.tagName);
        },
        handleSubmit: (e) => {
            e.preventDefault();
            addLog('Form Submit', inputValue);
        },
        handleReset: () => {
            setInputValue('');
            addLog('Form Reset');
        },

        // Keyboard Events
        handleKeyDown: (e) => {
            setKeyPressed(e.key);
            addLog('Key Down', e.key);
        },
        handleKeyUp: (e) => {
            setKeyPressed('');
            addLog('Key Up', e.key);
        },
        handleKeyPress: (e) => addLog('Key Press', e.key),

        // Touch Events (for mobile)
        handleTouchStart: () => addLog('Touch Start'),
        handleTouchEnd: () => addLog('Touch End'),
        handleTouchMove: () => addLog('Touch Move'),

        // Drag Events
        handleDragStart: (e) => {
            e.dataTransfer.setData('text/plain', dragText);
            addLog('Drag Start');
        },
        handleDrag: () => addLog('Dragging'),
        handleDragOver: (e) => {
            e.preventDefault();
            addLog('Drag Over');
        },
        handleDrop: (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            setDragText(data + ' (dropped!)');
            addLog('Drop', data);
        },
        handleDragEnd: () => addLog('Drag End'),

        // Context Menu
        handleContextMenu: (e) => {
            e.preventDefault();
            addLog('Context Menu (Right Click)');
        },

        // Wheel Event
        handleWheel: (e) => {
            addLog('Mouse Wheel', e.deltaY > 0 ? 'Down' : 'Up');
        },

        // Clear logs
        clearLogs: () => setLogs([])
    });

    return html`
        <style>
            .events-demo {
                padding: 20px;
                border: 2px solid #3498db;
                border-radius: 10px;
                font-family: 'Monaco', 'Courier New', monospace;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            }

            .demo-section {
                margin-bottom: 20px;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border-left: 4px solid #3498db;
            }

            .demo-section h4 {
                margin: 0 0 10px 0;
                color: #2c3e50;
            }

            .event-area {
                padding: 20px;
                margin: 10px 0;
                border: 2px dashed #bdc3c7;
                border-radius: 5px;
                background: #ecf0f1;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .event-area:hover {
                background: #d5dbdb;
                border-color: #3498db;
            }

            .mouse-tracker {
                position: relative;
                height: 100px;
                background: linear-gradient(45deg, #e74c3c, #f39c12);
                border-radius: 5px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: crosshair;
            }

            .draggable {
                padding: 15px;
                background: #2ecc71;
                color: white;
                border-radius: 5px;
                cursor: move;
                display: inline-block;
                margin: 10px;
            }

            .drop-zone {
                min-height: 80px;
                border: 3px dashed #95a5a6;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ecf0f1;
                transition: all 0.3s ease;
            }

            .drop-zone:hover,
            .drop-zone.dragover {
                border-color: #2ecc71;
                background: #d5f4e6;
            }

            .form-controls {
                display: flex;
                gap: 10px;
                margin: 10px 0;
                flex-wrap: wrap;
            }

            .form-controls input,
            .form-controls button,
            .form-controls select {
                padding: 8px 12px;
                border: 2px solid #bdc3c7;
                border-radius: 4px;
                font-size: 14px;
            }

            .form-controls button {
                background: #3498db;
                color: white;
                border-color: #3498db;
                cursor: pointer;
            }

            .form-controls button:hover {
                background: #2980b9;
            }

            .logs {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 15px;
                border-radius: 5px;
                font-family: 'Monaco', monospace;
                font-size: 12px;
                max-height: 300px;
                overflow-y: auto;
                margin-top: 15px;
            }

            .log-entry {
                margin: 2px 0;
                padding: 2px 0;
            }

            .status {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: bold;
            }

            .status.focused {
                background: #2ecc71;
                color: white;
            }

            .status.blurred {
                background: #95a5a6;
                color: white;
            }

            .key-display {
                background: #34495e;
                color: white;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                font-weight: bold;
                min-height: 20px;
                margin: 10px 0;
            }
        </style>

        <div class="events-demo">
            <h3>🎯 Comprehensive Events Demo</h3>
            <p>This component demonstrates all supported event types in Glint.</p>

            <div class="demo-section">
                <h4>🖱️ Mouse Events</h4>
                <div class="mouse-tracker" 
                     onclick="handleClick"
                     ondblclick="handleDoubleClick"
                     onmousedown="handleMouseDown"
                     onmouseup="handleMouseUp"
                     onmouseover="handleMouseOver"
                     onmouseout="handleMouseOut"
                     onmousemove="handleMouseMove"
                     onmouseenter="handleMouseEnter"
                     onmouseleave="handleMouseLeave"
                     oncontextmenu="handleContextMenu"
                     onwheel="handleWheel">
                    Mouse Position: (${mousePos.x}, ${mousePos.y})
                    <br><small>Try: click, double-click, move, right-click, scroll</small>
                </div>
            </div>

            <div class="demo-section">
                <h4>📝 Form Events</h4>
                <form onsubmit="handleSubmit" onreset="handleReset">
                    <div class="form-controls">
                        <input type="text" 
                               value="${inputValue}" 
                               placeholder="Type something..."
                               onchange="handleChange"
                               oninput="handleInput"
                               onfocus="handleFocus"
                               onblur="handleBlur" />
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                        <span class="status ${focusState}">${focusState || 'neutral'}</span>
                    </div>
                </form>
            </div>

            <div class="demo-section">
                <h4>⌨️ Keyboard Events</h4>
                <input type="text" 
                       placeholder="Press keys here..."
                       onkeydown="handleKeyDown"
                       onkeyup="handleKeyUp"
                       onkeypress="handleKeyPress" />
                <div class="key-display">
                    ${keyPressed ? 'Key Pressed: ' + keyPressed : 'Press any key...'}
                </div>
            </div>

            <div class="demo-section">
                <h4>📱 Touch Events (Mobile)</h4>
                <div class="event-area"
                     ontouchstart="handleTouchStart"
                     ontouchend="handleTouchEnd"
                     ontouchmove="handleTouchMove">
                    Touch this area (mobile devices)
                </div>
            </div>

            <div class="demo-section">
                <h4>🔄 Drag & Drop Events</h4>
                <div draggable="true" 
                     class="draggable"
                     ondragstart="handleDragStart"
                     ondrag="handleDrag"
                     ondragend="handleDragEnd">
                    ${dragText}
                </div>
                <div class="drop-zone"
                     ondragover="handleDragOver"
                     ondrop="handleDrop">
                    Drop zone - drag the item above here
                </div>
            </div>

            <div class="demo-section">
                <h4>📊 Event Logs</h4>
                <button onclick="clearLogs">Clear Logs</button>
                <div class="logs">
                    ${logs.map(log => '<div class="log-entry">' + log + '</div>').join('')}
                    ${logs.length === 0 ? '<div class="log-entry">No events logged yet...</div>' : ''}
                </div>
            </div>
        </div>
    `;
}

// Auto-register as web component
customElements.define('events-demo', createComponent(EventsDemo, 'events-demo'));



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



// Component: UtilsDemoComponent
function UtilsDemo() {
    const [a, setA] = useState(5);
    const [b, setB] = useState(3);
    const [result, setResult] = useState(0);
    const [operation, setOperation] = useState('add');

    const performCalculation = () => {
        let newResult;
        switch (operation) {
            case 'add':
                newResult = MathUtils.add(a, b);
                break;
            case 'multiply':
                newResult = MathUtils.multiply(a, b);
                break;
            case 'square':
                newResult = MathUtils.square(a);
                break;
            case 'factorial':
                newResult = MathUtils.factorial(a);
                break;
            default:
                newResult = 0;
        }
        setResult(newResult);
    };

    const randomizeValues = () => {
        setA(randomBetween(1, 10));
        setB(randomBetween(1, 10));
    };

    useHandlers({
        performCalculation,
        randomizeValues,
        updateA: (e) => setA(parseInt(e.target.value) || 0),
        updateB: (e) => setB(parseInt(e.target.value) || 0),
        updateOperation: (e) => setOperation(e.target.value)
    });

    return html`
        <style>
            .utils-demo {
                padding: 20px;
                border: 2px solid #007acc;
                border-radius: 10px;
                font-family: Arial, sans-serif;
            }
            
            .controls {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                align-items: center;
            }
            
            .result {
                font-size: 1.5rem;
                font-weight: bold;
                color: #007acc;
                margin: 15px 0;
            }
            
            input, select, button {
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
            }
            
            button {
                background: #007acc;
                color: white;
                border: none;
                cursor: pointer;
            }
            
            button:hover {
                background: #005a9e;
            }
        </style>
        
        <div class="utils-demo">
            <h3>Math Utils Demo - Using Utility Functions</h3>
            
            <div class="controls">
                <label>A: <input type="number" value="${a}" onchange="updateA" /></label>
                <label>B: <input type="number" value="${b}" onchange="updateB" /></label>
                <select onchange="updateOperation" value="${operation}">
                    <option value="add">Add</option>
                    <option value="multiply">Multiply</option>
                    <option value="square">Square A</option>
                    <option value="factorial">Factorial A</option>
                </select>
            </div>
            
            <div class="controls">
                <button onclick="performCalculation">Calculate</button>
                <button onclick="randomizeValues">Random Values</button>
            </div>
            
            <div class="result">
                Result: ${MathUtils.formatNumber(result)}
            </div>
        </div>
    `;
}

// Auto-register as web component
customElements.define('utils-demo', createComponent(UtilsDemo, 'utils-demo'));



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

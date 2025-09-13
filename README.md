# 🚀 Glint Framework v2.0

**A clean, simple, React-inspired web component framework with zero dependencies.**

Glint provides a modern developer experience with JSX-like syntax, reactive state management, and automatic hot-reload - all in ~600 lines of code with no external dependencies.

![Glint Framework](https://img.shields.io/badge/Glint-v2.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Size](https://img.shields.io/badge/Size-~600%20LOC-orange?style=for-the-badge)
![Dependencies](https://img.shields.io/badge/Dependencies-0-red?style=for-the-badge)

## ✨ Features

- 🎯 **JSX-like Function Components** - Clean, readable component syntax
- ⚡ **Reactive State Management** - Local state + global named stores
- 🎪 **32+ Event Types** - Mouse, keyboard, touch, drag & drop, and more
- 🎨 **Shadow DOM Encapsulation** - Scoped styling out of the box
- 📦 **Automatic Bundling** - Components, stores, and utilities combined
- 🔥 **Hot Reload** - Instant development feedback
- 🏷️ **HTML Tagged Templates** - Syntax highlighting in VS Code
- 📱 **Mobile Ready** - Touch events and responsive design
- 🛠️ **Zero Configuration** - Works out of the box

## 🚀 Quick Start

### Installation

```bash
# Clone or download Glint
git clone https://github.com/your-username/glint.git
cd glint

# Install dependencies (for development server only)
npm install

# Create your first project
mkdir my-app && cd my-app
npm init -y
```

### Project Structure

```
my-app/
├── src/
│   ├── index.html              # Main HTML file
│   ├── components/             # Component files
│   │   └── hello-world.glint.js
│   ├── stores/                 # Global state stores
│   │   └── counter.store.js
│   └── utils/                  # Utility functions
│       └── helpers.js
├── build/                      # Generated files (auto-created)
└── package.json
```

### Your First Component

**src/components/hello-world.glint.js**
```javascript
function HelloWorld() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState('World');

    useHandlers({
        increment: () => setCount(count + 1),
        updateName: (e) => setName(e.target.value)
    });

    return html`
        <style>
            .hello-world {
                padding: 20px;
                text-align: center;
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-radius: 10px;
            }
            
            .counter {
                font-size: 2rem;
                margin: 10px 0;
            }
            
            input, button {
                padding: 10px;
                margin: 5px;
                border: none;
                border-radius: 5px;
            }
            
            button {
                background: white;
                color: #333;
                cursor: pointer;
            }
            
            button:hover {
                background: #f0f0f0;
            }
        </style>
        
        <div class="hello-world">
            <h1>Hello, ${name}!</h1>
            
            <div class="counter">Count: ${count}</div>
            
            <input type="text" 
                   value="${name}" 
                   onchange="updateName" 
                   placeholder="Enter your name" />
            
            <button onclick="increment">Increment</button>
        </div>
    `;
}
```

**src/index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Glint App</title>
</head>
<body>
    <h1>My First Glint App</h1>
    <hello-world></hello-world>
</body>
</html>
```

### Build and Run

```bash
# Build your app
node /path/to/glint.js

# Development with hot reload
node /path/to/glint.js --watch

# Open http://localhost:3000 in your browser
```

## 📚 Core Concepts

### 1. Function Components

Components are pure JavaScript functions that return HTML strings using tagged template literals:

```javascript
function MyComponent({ title = "Default Title" }) {
    const [isVisible, setIsVisible] = useState(true);
    
    useHandlers({
        toggle: () => setIsVisible(!isVisible)
    });
    
    return html`
        <div class="my-component">
            <h2>${title}</h2>
            ${isVisible ? '<p>Content is visible!</p>' : '<p>Content is hidden</p>'}
            <button onclick="toggle">${isVisible ? 'Hide' : 'Show'}</button>
        </div>
    `;
}
```

### 2. Local State with useState

Manage component-specific state that triggers re-renders:

```javascript
function Counter() {
    const [count, setCount] = useState(0);
    const [step, setStep] = useState(1);
    
    useHandlers({
        increment: () => setCount(count + step),
        decrement: () => setCount(count - step),
        reset: () => setCount(0),
        updateStep: (e) => setStep(parseInt(e.target.value) || 1)
    });
    
    return html`
        <div>
            <p>Count: ${count}</p>
            <input type="number" value="${step}" onchange="updateStep" placeholder="Step" />
            <button onclick="increment">+${step}</button>
            <button onclick="decrement">-${step}</button>
            <button onclick="reset">Reset</button>
        </div>
    `;
}
```

### 3. Global State with Named Stores

Share state across components using named stores:

**src/stores/user.store.js**
```javascript
createStore('user', 
    // Initial state
    { 
        name: '', 
        email: '', 
        isLoggedIn: false 
    },
    // Actions
    {
        login: (get, set, userData) => {
            set({ 
                name: userData.name,
                email: userData.email,
                isLoggedIn: true 
            });
        },
        
        logout: (get, set) => {
            set({ 
                name: '', 
                email: '', 
                isLoggedIn: false 
            });
        },
        
        updateProfile: (get, set, updates) => {
            set({ ...get(), ...updates });
        }
    }
);
```

**Using in components:**
```javascript
function UserProfile() {
    const [userState, userActions] = useStore('user');
    
    useHandlers({
        handleLogin: () => userActions.login({ 
            name: 'John Doe', 
            email: 'john@example.com' 
        }),
        handleLogout: () => userActions.logout(),
        updateName: (e) => userActions.updateProfile({ name: e.target.value })
    });
    
    return html`
        <div>
            ${userState.isLoggedIn 
                ? html`
                    <p>Welcome, ${userState.name}!</p>
                    <input value="${userState.name}" onchange="updateName" />
                    <button onclick="handleLogout">Logout</button>
                  `
                : html`
                    <button onclick="handleLogin">Login</button>
                  `
            }
        </div>
    `;
}
```

### 4. Event Handling

Glint supports 32+ event types with automatic binding:

```javascript
function EventsExample() {
    const [log, setLog] = useState([]);
    
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLog(prev => [`${timestamp}: ${message}`, ...prev].slice(0, 10));
    };
    
    useHandlers({
        // Mouse events
        handleClick: () => addLog('Clicked'),
        handleDoubleClick: () => addLog('Double clicked'),
        handleMouseOver: () => addLog('Mouse over'),
        
        // Form events
        handleChange: (e) => addLog(`Input: ${e.target.value}`),
        handleFocus: () => addLog('Focused'),
        handleBlur: () => addLog('Blurred'),
        
        // Keyboard events
        handleKeyDown: (e) => addLog(`Key: ${e.key}`),
        
        // Touch events (mobile)
        handleTouchStart: () => addLog('Touch started'),
        
        // Drag events
        handleDragStart: () => addLog('Drag started'),
        handleDrop: (e) => {
            e.preventDefault();
            addLog('Dropped');
        }
    });
    
    return html`
        <div>
            <!-- Mouse events -->
            <button onclick="handleClick" 
                    ondblclick="handleDoubleClick"
                    onmouseover="handleMouseOver">
                Click me
            </button>
            
            <!-- Form events -->
            <input onchange="handleChange" 
                   onfocus="handleFocus" 
                   onblur="handleBlur"
                   onkeydown="handleKeyDown"
                   placeholder="Type here" />
            
            <!-- Touch events -->
            <div ontouchstart="handleTouchStart" 
                 style="padding: 20px; background: #f0f0f0;">
                Touch area (mobile)
            </div>
            
            <!-- Drag & drop -->
            <div draggable="true" ondragstart="handleDragStart"
                 style="padding: 10px; background: #007acc; color: white;">
                Drag me
            </div>
            <div ondrop="handleDrop" 
                 ondragover="(e) => e.preventDefault()"
                 style="padding: 20px; border: 2px dashed #ccc;">
                Drop zone
            </div>
            
            <!-- Event log -->
            <ul style="max-height: 200px; overflow-y: auto;">
                ${log.map(entry => `<li>${entry}</li>`).join('')}
            </ul>
        </div>
    `;
}
```

### 5. Props System

Components automatically receive props from HTML attributes:

```javascript
// Component definition
function UserCard({ name, age, role = "User", avatar }) {
    return html`
        <style>
            .user-card {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
                margin: 10px;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #007acc;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
            }
        </style>
        
        <div class="user-card">
            <div class="avatar">${avatar || name.charAt(0)}</div>
            <h3>${name}</h3>
            <p>Age: ${age}</p>
            <p>Role: ${role}</p>
        </div>
    `;
}
```

```html
<!-- Usage in HTML -->
<user-card name="Alice" age="25" role="Admin"></user-card>
<user-card name="Bob" age="30"></user-card>
<user-card name="Carol" age="28" role="Manager" avatar="👩‍💼"></user-card>
```

### 6. Utility Functions

Include regular JavaScript files for shared functionality:

**src/utils/helpers.js**
```javascript
const MathUtils = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b,
    formatNumber: (num) => new Intl.NumberFormat().format(num)
};

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

const DateUtils = {
    formatDate: (date) => new Intl.DateTimeFormat('en-US').format(date),
    timeAgo: (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }
};
```

**Using in components:**
```javascript
function Calculator() {
    const [a, setA] = useState(5);
    const [b, setB] = useState(3);
    const [result, setResult] = useState('');
    
    useHandlers({
        calculate: () => {
            // Utility functions are automatically available
            const sum = MathUtils.add(a, b);
            const formatted = formatCurrency(sum);
            setResult(`${MathUtils.formatNumber(a)} + ${MathUtils.formatNumber(b)} = ${formatted}`);
        },
        randomize: () => {
            setA(randomBetween(1, 100));
            setB(randomBetween(1, 100));
        },
        updateA: (e) => setA(parseInt(e.target.value) || 0),
        updateB: (e) => setB(parseInt(e.target.value) || 0)
    });
    
    return html`
        <div style="padding: 20px;">
            <h3>Calculator with Utilities</h3>
            <input type="number" value="${a}" onchange="updateA" />
            +
            <input type="number" value="${b}" onchange="updateB" />
            
            <br><br>
            <button onclick="calculate">Calculate</button>
            <button onclick="randomize">Random Numbers</button>
            
            <p><strong>${result}</strong></p>
            <p><small>Last updated: ${DateUtils.formatDate(new Date())}</small></p>
        </div>
    `;
}
```

## 🎨 Styling

### Shadow DOM Encapsulation

Every component uses Shadow DOM for style isolation:

```javascript
function StyledComponent() {
    const [theme, setTheme] = useState('blue');
    
    useHandlers({
        changeTheme: () => setTheme(theme === 'blue' ? 'red' : 'blue')
    });
    
    return html`
        <style>
            /* These styles only apply to this component */
            .container {
                background: linear-gradient(135deg, 
                    ${theme === 'blue' ? '#667eea, #764ba2' : '#f093fb, #f5576c'});
                padding: 20px;
                border-radius: 10px;
                color: white;
                font-family: Arial, sans-serif;
            }
            
            .button {
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid white;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .button:hover {
                background: white;
                color: #333;
                transform: translateY(-2px);
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .container {
                    padding: 10px;
                    border-radius: 5px;
                }
            }
        </style>
        
        <div class="container">
            <h2>Styled Component</h2>
            <p>Current theme: ${theme}</p>
            <button class="button" onclick="changeTheme">
                Switch to ${theme === 'blue' ? 'red' : 'blue'} theme
            </button>
        </div>
    `;
}
```

## 🛠️ Development

### File Watching & Hot Reload

Glint automatically watches for changes and reloads your browser:

```bash
# Start development server
node glint.js --watch

# Server runs on http://localhost:3000
# Changes to any .glint.js, .store.js, or .js file trigger rebuild
# Browser automatically refreshes via WebSocket
```

### Build Output

```bash
# Production build
node glint.js

# Generates:
# ├── build/
# │   ├── index.html          # Processed HTML with script injection
# │   └── glint-bundle.js     # Complete application bundle
```

### Project Organization

```
my-project/
├── src/
│   ├── index.html                  # Main HTML template
│   ├── components/                 # Component files (*.glint.js)
│   │   ├── header.glint.js
│   │   ├── navigation.glint.js
│   │   ├── user-profile.glint.js
│   │   └── footer.glint.js
│   ├── stores/                     # Global state (*.store.js)
│   │   ├── auth.store.js
│   │   ├── shopping-cart.store.js
│   │   └── settings.store.js
│   └── utils/                      # Utility functions (*.js)
│       ├── api-client.js
│       ├── date-helpers.js
│       └── validation.js
├── build/                          # Generated files
│   ├── index.html
│   └── glint-bundle.js
└── package.json
```

## 📱 Advanced Patterns

### Conditional Rendering

```javascript
function ConditionalExample() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState(['Apple', 'Banana', 'Orange']);
    const [showDetails, setShowDetails] = useState(false);
    
    useHandlers({
        login: async () => {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setUser({ name: 'John Doe', role: 'admin' });
                setLoading(false);
            }, 1000);
        },
        logout: () => setUser(null),
        toggleDetails: () => setShowDetails(!showDetails),
        removeItem: (e) => {
            const index = parseInt(e.target.dataset.index);
            setItems(items.filter((_, i) => i !== index));
        }
    });
    
    return html`
        <div>
            <!-- Loading state -->
            ${loading ? 
                '<div>🔄 Loading...</div>' : 
                ''
            }
            
            <!-- User authentication state -->
            ${user 
                ? html`
                    <div>
                        <p>Welcome, ${user.name}!</p>
                        ${user.role === 'admin' ? '<p>🔧 Admin Panel Available</p>' : ''}
                        <button onclick="logout">Logout</button>
                    </div>
                  ` 
                : html`
                    <div>
                        <p>Please log in</p>
                        <button onclick="login">Login</button>
                    </div>
                  `
            }
            
            <!-- Conditional content with toggle -->
            <button onclick="toggleDetails">
                ${showDetails ? 'Hide' : 'Show'} Details
            </button>
            
            ${showDetails ? html`
                <div>
                    <h3>Item List</h3>
                    <ul>
                        ${items.map((item, index) => 
                            `<li>
                                ${item} 
                                <button onclick="removeItem" data-index="${index}">×</button>
                             </li>`
                        ).join('')}
                    </ul>
                    ${items.length === 0 ? '<p>No items remaining</p>' : ''}
                </div>
              ` : ''}
        </div>
    `;
}
```

### Component Communication

```javascript
// Parent component
function Dashboard() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [notification, setNotification] = useState('');
    
    useHandlers({
        onUserSelect: (userId) => {
            setSelectedUser(userId);
            setNotification(`Selected user: ${userId}`);
        },
        clearNotification: () => setNotification('')
    });
    
    return html`
        <div class="dashboard">
            ${notification ? html`
                <div class="notification">
                    ${notification}
                    <button onclick="clearNotification">×</button>
                </div>
              ` : ''}
            
            <user-list onselect="onUserSelect"></user-list>
            
            ${selectedUser ? 
                `<user-details user-id="${selectedUser}"></user-details>` : 
                '<p>Select a user to view details</p>'
            }
        </div>
    `;
}

// Child component - UserList
function UserList({ onselect }) {
    const [users] = useStore('users');
    
    useHandlers({
        selectUser: (e) => {
            const userId = e.target.dataset.userId;
            // Call parent callback if available
            if (onselect && window[onselect]) {
                window[onselect](userId);
            }
        }
    });
    
    return html`
        <div class="user-list">
            <h3>Users</h3>
            ${users.map(user => 
                `<div class="user-item" 
                      data-user-id="${user.id}" 
                      onclick="selectUser"
                      style="padding: 10px; cursor: pointer; border: 1px solid #ddd; margin: 5px;">
                    👤 ${user.name}
                 </div>`
            ).join('')}
        </div>
    `;
}
```

## ⚡ Performance Tips

### 1. Minimize Re-renders
```javascript
// Good: Separate concerns
function OptimizedComponent() {
    const [count, setCount] = useState(0);
    const [name] = useState('John'); // Static data
    const [theme] = useStore('theme');
    
    // Only re-renders when count changes
    return html`
        <div>
            <h3>${name}</h3> <!-- Static -->
            <p>Count: ${count}</p> <!-- Dynamic -->
            <button onclick="increment">+1</button>
        </div>
    `;
}
```

### 2. Use Efficient List Rendering
```javascript
function OptimizedList({ items }) {
    return html`
        <ul>
            ${items.map(item => 
                `<li key="${item.id}">
                    <strong>${item.name}</strong> - ${item.description}
                 </li>`
            ).join('')}
        </ul>
    `;
}
```

### 3. Lazy Loading
```javascript
function LazyDemo() {
    const [loadHeavyComponent, setLoadHeavyComponent] = useState(false);
    
    useHandlers({
        load: () => setLoadHeavyComponent(true)
    });
    
    return html`
        <div>
            ${loadHeavyComponent 
                ? '<heavy-data-component></heavy-data-component>' 
                : '<button onclick="load">Load Heavy Component</button>'
            }
        </div>
    `;
}
```

## 📦 API Reference

### Core Functions

#### `useState(initialValue)`
```javascript
const [state, setState] = useState(initialValue);
```
- **initialValue**: Any value to initialize state
- **Returns**: Array with `[currentValue, setterFunction]`

#### `useStore(storeName, initialState?, actions?)`
```javascript
const [state, actions] = useStore('storeName', initialState, actions);
```
- **storeName**: Unique identifier for the store
- **initialState**: Initial state object (optional if store exists)
- **actions**: Actions object (optional if store exists)
- **Returns**: Array with `[currentState, boundActions]`

#### `useHandlers(handlersObject)`
```javascript
useHandlers({
    handlerName: (event) => { /* handler logic */ }
});
```
- **handlersObject**: Object mapping handler names to functions

#### `html` Tagged Template
```javascript
const template = html`<div>${content}</div>`;
```
- **Returns**: HTML string with interpolated values
- **Benefits**: Syntax highlighting in VS Code

#### `createStore(name, initialState, actions)`
```javascript
createStore('storeName', { count: 0 }, {
    increment: (get, set) => set({ count: get().count + 1 })
});
```
- **name**: Unique store identifier
- **initialState**: Initial state object
- **actions**: Object with functions receiving `(get, set, ...args)`

### Supported Events (32+)

**Mouse Events:**
- `onclick`, `ondblclick`, `onmousedown`, `onmouseup`
- `onmouseover`, `onmouseout`, `onmousemove`
- `onmouseenter`, `onmouseleave`
- `oncontextmenu`, `onwheel`

**Form Events:**
- `onchange`, `oninput`, `onsubmit`
- `onfocus`, `onblur`, `onselect`
- `onreset`, `oninvalid`

**Keyboard Events:**
- `onkeydown`, `onkeyup`, `onkeypress`

**Touch Events (Mobile):**
- `ontouchstart`, `ontouchend`
- `ontouchmove`, `ontouchcancel`

**Drag & Drop Events:**
- `ondragstart`, `ondrag`, `ondragenter`
- `ondragover`, `ondragleave`, `ondrop`, `ondragend`

**Media Events:**
- `onloadstart`, `onloadeddata`, `onloadedmetadata`
- `oncanplay`, `oncanplaythrough`
- `onplay`, `onpause`, `onended`, `onvolumechange`

**Window/Document Events:**
- `onload`, `onerror`, `onresize`, `onscroll`, `onunload`

**Animation Events:**
- `onanimationstart`, `onanimationend`
- `ontransitionstart`, `ontransitionend`

## 🚀 Deployment

### Static Hosting
```bash
# Build for production
node glint.js

# Deploy build/ folder to:
# - Netlify: Simply drag & drop build/ folder
# - Vercel: Connect GitHub repo and set build command
# - GitHub Pages: Push build/ to gh-pages branch
# - Any static host: Upload build/ contents
```

### Example Deployment Scripts

**package.json scripts:**
```json
{
  "scripts": {
    "build": "node glint.js",
    "dev": "node glint.js --watch",
    "deploy": "npm run build && gh-pages -d build"
  }
}
```

### CDN Deployment
```html
<!-- Serve your bundle from any CDN -->
<script src="https://your-cdn.com/glint-bundle.js"></script>
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes and test thoroughly**
4. **Commit your changes:** `git commit -m 'Add amazing feature'`
5. **Push to the branch:** `git push origin feature/amazing-feature`
6. **Submit a Pull Request**

### Development Setup
```bash
git clone https://github.com/your-username/glint.git
cd glint
npm install
cd example
node ../glint.js --watch
```

## 🙋 FAQ

### Q: How does Glint compare to React?
**A:** Glint provides similar concepts (components, state, props) but is much smaller (~600 LOC vs React's ~100KB) and has zero dependencies. It's perfect for projects that need React-like patterns without the complexity and bundle size.

### Q: Can I use Glint with existing websites?
**A:** Absolutely! Glint components are standard web components and can be embedded in any HTML page, even alongside other frameworks like jQuery, Vue, or React.

### Q: Does Glint support npm packages?
**A:** Currently, Glint bundles only your local `.js` files. For npm packages, you can either copy them to your `utils/` directory or include them via CDN links in your HTML.

### Q: Is TypeScript supported?
**A:** Not directly, but since components are standard JavaScript, you could compile TypeScript files separately and output them to your `utils/` directory.

### Q: How do I handle routing?
**A:** Glint doesn't include routing (yet!), but you can implement simple routing with URL hash changes or use a lightweight routing library in your `utils/` directory.

### Q: Is Glint production-ready?
**A:** Yes! Glint v2.0 is stable and suitable for production. It's particularly great for:
- 📊 Dashboards and admin panels
- 🎨 Interactive demos and portfolios  
- 📱 Progressive Web Apps (PWAs)
- 🛍️ E-commerce sites
- 📚 Documentation sites with interactive examples

### Q: What about SEO?
**A:** Since Glint uses client-side rendering, SEO requires consideration. For SEO-critical sites, you might want to use server-side rendering or static generation tools, or consider pre-rendering your pages.

### Q: How do I debug Glint apps?
**A:** Use browser DevTools normally. Components appear as custom elements, and you can inspect their Shadow DOM. The development server provides clear error messages and hot reload helps with rapid debugging.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🌟 Examples

Check out the `/example` directory in this repository for complete working examples including:

- 📊 **Dashboard Components** - Real-world UI patterns
- 🛍️ **Shopping Cart** - State management examples  
- 🎮 **Interactive Demos** - Event handling showcases
- 🎨 **Styled Components** - CSS and theming examples
- 📱 **Mobile-Ready** - Touch and responsive design

---

**Built with ❤️ for developers who love simplicity**

*Start building amazing web applications with Glint today!*

# 🚀 Glint Framework

**A tiny, powerful Vue/Svelte-like component framework built on Web Components with minimal dependencies**

Glint combines the simplicity of Web Components with the power of modern reactive frameworks. Write component-based UIs with global state management, enhanced templating, and a fantastic developer experience.

## ✨ Features

- 🏗️ **Component-based architecture** using Web Components under the hood
- 🔄 **Reactive global state management** (Vue 3 Composition API style)
- 🎨 **Enhanced templating** with full JavaScript expression support
- 🎣 **Hooks system** for global and component-level state changes
- ⚡ **Hot reload development server**
- 🛡️ **Compile-time validation** to prevent common architectural mistakes
- 📦 **Smart bundling** - automatically bundles JavaScript files
- 🔒 **Memory leak prevention** with automatic cleanup
- 🎯 **Zero runtime dependencies** - pure Web Components output

## 🏁 Quick Start

See: [CHEETSHEET.md](CHEATSHEET.md) for a quick, dense overview.

### Installation

```bash
npm install -g glint-compiler
# or
npx glint-compiler
```

### Project Setup

Create your project structure:

**Required files:**
- `src/index.html` - Your main HTML template
- `src/main.glint` - Your main component

**Everything else is flexible:**
```
my-app/
├── src/
│   ├── index.html           # Required
│   ├── main.glint           # Required
│   └── components/          # Optional - organize as you like
│       └── hello-world.glint
├── user.js                  # Optional - global state files
└── package.json
```

Glint will automatically find all `.glint` files within the `src/` folder and its subdirectories.

### Your First Component

**src/components/hello-world.glint**
```html
<template>
  <div class="hello">
    <h1>{{this.greeting}}!</h1>
    <p>Count: {{this.count}}</p>
    <button onclick="this.increment()">Click me</button>
  </div>
</template>

<script>
  // Component properties (can be passed from parent)
  export let greeting = 'Hello World';
  
  // Reactive component state
  this.count = 0;
  
  // Methods
  function increment() {
    this.count++;
  }
</script>

<style>
  .hello {
    padding: 2rem;
    text-align: center;
    border: 2px solid #42b883;
    border-radius: 8px;
  }
  
  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
```

### Build & Run

```bash
# Development with hot reload
glint --watch

# Production build  
glint

# Built files appear in build/ directory
```

Visit `http://localhost:3000` to see your app!

## 📚 Component System

### Component Structure

Every `.glint` file has three sections:

```html
<template>
  <!-- Your HTML with {{}} interpolation -->
</template>

<script>
  // Component properties (from parent)
  export let title = 'Default Title';
  export let items = [];
  
  // Reactive component state  
  this.count = 0;
  this.isLoading = false;
  
  // Non-reactive variables
  const API_URL = 'https://api.example.com';
  let cache = {};
  
  // Component logic and methods
</script>

<style>
  /* Scoped CSS styles */
</style>
```

### Component Properties & State

```html
<script>
  // Component properties (passed from parent components)
  export let message = 'Hello';
  export let initialCount = 0;
  export let user = null;
  
  // Reactive component state (triggers re-renders when changed)
  this.count = this.initialCount || 0;
  this.isVisible = true;
  this.items = ['apple', 'banana', 'cherry'];
  this.currentUser = this.user || { name: 'Anonymous' };
  
  // Non-reactive variables (do NOT trigger re-renders)
  let apiKey = 'secret-key-123';
  const MAX_ITEMS = 100;
  var tempData = {};
  
  // Methods
  function handleClick() {
    this.count++;  // Reactive - triggers re-render
    tempData.lastClicked = Date.now();  // Non-reactive - no re-render
    this.message = 'Clicked ' + this.count + ' times';  // Reactive
  }
</script>
```

**Key Differences:**
- `export let propName` = Properties passed from parent components
- `this.varName` = Reactive state that triggers re-renders when changed
- `let/const/var varName` = Non-reactive variables for internal logic only

### Component Lifecycle

```html
<script>
  function onMounted() {
    console.log('Component mounted!');
    // DOM is ready, setup logic here
  }
  
  function onUnmounted() {
    console.log('Component unmounted!');
    // Cleanup logic here
  }
</script>
```

## 🎨 Enhanced Templating

Glint supports full JavaScript expressions in `{{}}` interpolation:

### Basic Interpolation
```html
<template>
  <p>Hello {{this.name}}!</p>
  <p>Count: {{this.count}}</p>
</template>
```

### Conditional Rendering
```html
<template>
  <!-- Simple conditionals -->
  {{ this.isLoggedIn ? '<div>Welcome back!</div>' : '<div>Please login</div>' }}
  
  <!-- Complex conditions -->
  {{ this.user.role === 'admin' && this.user.active ? '<button>Admin Panel</button>' : '' }}
</template>
```

### Loop Rendering
```html
<template>
  <!-- Array loops -->
  {{ this.items.map(item => '<div class="item">' + item + '</div>').join('') }}
  
  <!-- With index -->
  {{ this.users.map((user, index) => '<div>' + (index + 1) + '. ' + user.name + '</div>').join('') }}
  
  <!-- Filtered loops -->
  {{ this.posts.filter(p => p.published).map(post => '<article>' + post.title + '</article>').join('') }}
</template>
```

### Expression Examples
```html
<template>
  <!-- Math operations -->
  <p>Total: {{ this.items.length + this.extraCount }}</p>
  
  <!-- String operations -->
  <p>{{ this.firstName + ' ' + this.lastName }}</p>
  
  <!-- Array operations -->
  <p>{{ this.items.slice(0, 3).join(', ') }}</p>
  
  <!-- Object access -->
  <p>{{ this.user.preferences.theme || 'light' }}</p>
</template>
```

## 🔄 Global State Management

### Creating Global State

**user.js**
```javascript
// Create reactive global state
const userState = createState('user', {
  name: 'Anonymous',
  email: '',
  isLoggedIn: false,
  preferences: { theme: 'dark' }
});

// Create global actions
const userActions = createActions('user', {
  login(name, email) {
    userState.name = name;
    userState.email = email;
    userState.isLoggedIn = true;
  },
  
  logout() {
    userState.name = 'Anonymous';
    userState.email = '';
    userState.isLoggedIn = false;
  },
  
  updateTheme(theme) {
    userState.preferences.theme = theme;
  }
});

// Create global hooks (side effects)
const userHooks = createHooks('user', {
  // Runs when name changes
  name: (newName, oldName) => {
    console.log('Name changed:', oldName, '->', newName);
    document.title = `App - ${newName}`;
  },
  
  // Runs when login status changes
  isLoggedIn: (isLoggedIn) => {
    if (isLoggedIn) {
      console.log('User logged in!');
    } else {
      console.log('User logged out!');
    }
  }
});
```

### Using Global State in Components

```html
<template>
  <div>
    <h3>Welcome {{this.userState.name}}</h3>
    <p>Status: {{this.userState.isLoggedIn ? 'Online' : 'Offline'}}</p>
    <button onclick="this.handleLogin()">Login</button>
  </div>
</template>

<script>
  // Access global state
  this.userState = useState('user');
  
  // Access global actions
  this.userActions = useActions('user');
  
  // Component-level state hooks with automatic cleanup
  function onMounted() {
    this.onStateChange('user', 'name', (newName) => {
      console.log('Component saw name change:', newName);
    });
    
    this.onStateChange('user', 'isLoggedIn', (isLoggedIn) => {
      // Component-specific logic when login status changes
      this.updateUI(isLoggedIn);
    });
  }
  
  function handleLogin() {
    this.userActions.login('John Doe', 'john@example.com');
  }
  
  function updateUI(isLoggedIn) {
    // Component-specific UI updates
  }
</script>
```

## 🎣 Hooks System

### Global Hooks (Side Effects)
```javascript
// In global JS files
const appHooks = createHooks('user', {
  name: (newName) => {
    // Global side effect - runs for all name changes
    document.title = `App - ${newName}`;
    analytics.track('name_changed', { name: newName });
  },
  
  isLoggedIn: (isLoggedIn) => {
    // Global authentication side effects
    if (isLoggedIn) {
      api.authenticate();
    } else {
      api.clearAuth();
    }
  }
});
```

### Component Hooks (Auto-Cleanup)
```html
<script>
  function onMounted() {
    // Component-level hooks - automatically cleaned up when component is destroyed
    this.onStateChange('user', 'name', (newName) => {
      // Only affects this component
      this.updateProfileDisplay(newName);
    });
    
    this.onStateChange('app', 'theme', (theme) => {
      // Component-specific theme handling
      this.applyTheme(theme);
    });
  }
</script>
```

## 🛡️ Compile-Time Validation

Glint prevents common architectural mistakes:

### ❌ Prevents These Mistakes:
```html
<script>
  // ❌ ERROR: Don't create global state in components
  const badState = createState('bad', {}); 
  
  // ❌ ERROR: Don't create global actions in components  
  const badActions = createActions('bad', {});
  
  // ❌ ERROR: Don't create global hooks in components (memory leaks)
  const badHooks = createHooks('bad', {});
</script>
```

### ✅ Correct Patterns:
```html
<script>
  // ✅ GOOD: Access existing global state
  this.userState = useState('user');
  
  // ✅ GOOD: Use existing global actions
  this.userActions = useActions('user');
  
  // ✅ GOOD: Component-level hooks with auto-cleanup
  function onMounted() {
    this.onStateChange('user', 'name', callback);
  }
</script>
```

## 📦 Build System

### Development
```bash
# Hot reload development server
glint --watch
```

### Production
```bash
# Build for production
glint

# Output structure:
build/
├── index.html           # Processed HTML
├── glint-components.js  # All your components
└── user-bundle.js       # All your global JS files bundled
```

### Project Organization

```
my-app/
├── src/
│   ├── components/
│   │   ├── header.glint
│   │   ├── sidebar.glint
│   │   └── footer.glint
│   ├── main.glint
│   └── index.html
├── states/
│   ├── user.js
│   ├── app.js
│   └── auth.js
├── user.js              # Root level JS files
└── package.json
```

All `.js` files are automatically found, bundled into `user-bundle.js`, and included in your HTML.

## 🎯 Event Handling

### Supported Events
```html
<template>
  <button onclick="this.handleClick()">Click</button>
  <input onchange="this.handleChange(event)" />
  <input oninput="this.handleInput(event)" />
  <form onsubmit="this.handleSubmit(event)">...</form>
  <input onblur="this.handleBlur(event)" />
</template>
```

### Event Methods
```html
<script>
  function handleClick() {
    console.log('Button clicked!');
  }
  
  function handleChange(event) {
    this.value = event.target.value;
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    // Handle form submission
  }
</script>
```

## 🔧 Configuration

### package.json Scripts
```json
{
  "scripts": {
    "dev": "glint --watch",
    "build": "glint",
    "start": "glint --watch"
  },
  "devDependencies": {
    "glint-compiler": "^1.0.0"
  }
}
```

## 🚀 Advanced Examples

### Dynamic Component with State
```html
<template>
  <div class="todo-app">
    <h2>Todo App ({{this.todos.length}} items)</h2>
    
    {{ this.todos.map((todo, index) => 
       '<div class="todo ' + (todo.done ? 'done' : '') + '">' +
         '<input type="checkbox" ' + (todo.done ? 'checked' : '') + ' onchange="this.toggleTodo(' + index + ')" />' +
         '<span>' + todo.text + '</span>' +
         '<button onclick="this.removeTodo(' + index + ')">Remove</button>' +
       '</div>'
    ).join('') }}
    
    <div class="add-todo">
      <input type="text" oninput="this.updateText(event)" />
      <button onclick="this.addTodo()">Add</button>
    </div>
  </div>
</template>

<script>
  // Get global todo state
  this.todoState = useState('todos');
  this.todos = this.todoState.items;
  this.newTodoText = '';
  
  function onMounted() {
    // Watch for todo changes
    this.onStateChange('todos', 'items', (newTodos) => {
      this.todos = newTodos;
    });
  }

  function updateText(event) {
    this.newTodoText = event.target.value;
  }
  
  function addTodo() {
    if (this.newTodoText.trim()) {
      const actions = useActions('todos');
      actions.addTodo(this.newTodoText.trim());
      this.newTodoText = '';
    }
  }
  
  function toggleTodo(index) {
    const actions = useActions('todos');
    actions.toggleTodo(index);
  }
  
  function removeTodo(index) {
    const actions = useActions('todos');
    actions.removeTodo(index);
  }
</script>
```

### Global Todo State (todos.js)
```javascript
const todoState = createState('todos', {
  items: [
    { text: 'Learn Glint', done: false },
    { text: 'Build an app', done: false }
  ]
});

const todoActions = createActions('todos', {
  addTodo(text) {
    todoState.items.push({ text, done: false });
  },
  
  toggleTodo(index) {
    todoState.items[index].done = !todoState.items[index].done;
  },
  
  removeTodo(index) {
    todoState.items.splice(index, 1);
  }
});

const todoHooks = createHooks('todos', {
  items: (newItems) => {
    // Save to localStorage
    localStorage.setItem('todos', JSON.stringify(newItems));
    console.log('Todos updated:', newItems.length, 'items');
  }
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Inspired by Vue.js, Svelte, and the Web Components standard. Built with minimal dependencies for maximum performance and simplicity.

---

**Happy building with Glint! 🚀**

**Flexible organization examples:**
# Option 1: Flat structure
```
src/
├── index.html
├── glint-main.glint
├── button.glint
├── card.glint
└── modal.glint
```

# Option 2: Organized folders
```
src/
├── index.html
├── glint-main.glint
├── components/
│   ├── button.glint
│   └── card.glint
├── pages/
│   ├── home.glint
│   └── about.glint
└── ui/
    └── modal.glint
```

# Option 3: Your own structure
```
src/
├── index.html
├── glint-main.glint
├── widgets/
├── layouts/
└── features/
    └── auth/
        ├── login.glint
        └── register.glint
```

**Key points:**
- ✅ `src/index.html` and `src/glint-main.glint` are required
- ✅ Other `.glint` files can be organized however you like within `src/`
- ✅ Glint will recursively find all `.glint` files in `src/` and subdirectories

## Features

- 🧩 **Component-based architecture** - Split your HTML into reusable `.glint` components
- 📁 **Flexible structure** - Organize your components however you like within `src/`
- 🔍 **Recursive discovery** - Automatically finds all `.glint` files in `src/` and subdirectories
- 🔄 **Reactive state** - Variables declared with `this.` prefix automatically trigger re-renders when changed
- 📝 **Template interpolation** - Use `{{variable}}` syntax to display dynamic content
- 🎯 **Event handling** - Simple event binding with `onclick`, `onchange`, `oninput` etc.
- 🎨 **Scoped styling** - CSS in components is automatically scoped
- 🚀 **Development server** - Built-in dev server with live reload at `http://localhost:3000`
- ⚡ **Live reload** - Automatic browser refresh when files change during development
- 🔧 **Professional tooling** - Comprehensive error reporting, build statistics, and development experience

## Installation

**For end users:**
```bash
npm install -g glint-compiler
# or locally in your project
npm install glint-compiler
```

**For development (this repo):**
```bash
git clone https://github.com/RednibCoding/glint.git
cd glint
npm install
```

## Quick Start

**Development (from this repo):**
```bash
# Build example components
node src/glint.js

# Start development server with watch mode
node src/glint.js --watch

# Development server on custom port
node src/glint.js --dev --port 8080

# Show help
node src/glint.js --help
```

**Production usage:**
```bash
# After installing globally
glint
glint --watch
glint --dev --port 8080

# Or with npx
npx glint-compiler
npx glint-compiler --watch
```

## HTML Template Requirement

Glint requires an `index.html` template file in your project and a corresponding `main.glint` component file at the same level. The HTML file must contain a `<glint-main></glint-main>` element that corresponds to your main component.

**Example index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glint Example App</title>
</head>
<body>
    <!-- Main Glint app component -->
    <glint-main></glint-main>
</body>
</html>
```

**Required files:**
- `index.html` - Contains the `<glint-main></glint-main>` element
- `main.glint` - Your main component that gets mounted to `<glint-main>`

The compiler will automatically inject the JavaScript bundle before `</body>`.

## Component Structure

A `.glint` file consists of three sections:

```html
<template>
    <!-- Html goes herer -->
</template>

<script>
    // Js goes here
</script>
<style>
    /* Scoped CSS */
</style>
```

## Component Naming Convention

Component names must contain at least one hyphen (`-`) to distinguish them from regular HTML elements:

- ✅ `my-component.glint`
- ✅ `user-profile.glint`
- ✅ `nav-bar.glint`
- ❌ `component.glint` (no hyphen)


## Installation & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build your project:**
   ```bash
   npm run build
   ```

3. **Development server with live reload:**
   ```bash
   npm run dev
   ```
   
   This will:
   - 🚀 Start a development server at `http://localhost:3000`
   - 📁 Serve your compiled project automatically
   - 🔄 Watch for file changes and rebuild automatically
   - ⚡ Reload your browser automatically when files change
   - 🔍 Display helpful error messages and warnings

4. **Manual build and serve:**
   If you prefer to build manually:
   ```bash
   npm run build
   # Then open build/index.html in your browser
   ```

## Syntax Guide

### Template Interpolation
```html
<div>{{this.name}}</div>          <!-- variables variables -->
<div>{{this.getAge()}}</div>      <!-- methods -->
<div>Hello {{this.name}}!</div>
<div>Count: {{this.count}}</div>
```

### Event Handlers
```html
<button click="this.handleClick()">Click me</button>
<button click="this.increment()">Increment</button>
<input input="this.handleInput()" />
<form submit="this.handleSubmit()">...</form>
```

**Note**: Use `this.methodName()` syntax for calling component methods in event handlers.

### Props (Component Inputs)
```javascript
// In component script
export let name = "Default Name";
export let age = 0;
```

### Reactive State
```javascript
// Reactive variables are declared with this. prefix
this.count = 0;
this.isVisible = true;

function increment() {
    this.count++; // Reactive - triggers re-render
}

function toggle() {
    this.isVisible = !this.isVisible; // Reactive - triggers re-render
}
```

**Note**: Use `this.` prefix for reactive variables that trigger re-renders when changed.

## Example: Counter Component

**counter-component.glint:**
```html
<template>
    <h2>{{this.title}}</h2>
    <p>Count: {{this.count}}</p>
    <button onclick="this.increment()">+</button>
    <button onclick="this.decrement()">-</button>
    <button onclick="this.reset()">Reset</button>
</template>

<script>
    export let title = "Counter";
    this.count = 0;
    
    function increment() {
        this.count++;
    }
    
    function decrement() {
        this.count--;
    }
    
    function reset() {
        this.count = 0;
    }
</script>

<style>
    .counter {
        border: 1px solid #ccc;
        padding: 20px;
        margin: 10px;
        border-radius: 8px;
    }
    
    button {
        margin: 5px;
        padding: 8px 16px;
    }
</style>
```

**Usage:**
```html
<counter-component title="My Counter" />
<counter-component title="Second Counter" />
```

## Deployment

The compiled `build/` directory contains 3 files that need to be deployed together:

- `index.html` - The main HTML file with injected scripts
- `glint-components.js` - All your compiled components
- `user-bundle.js` - All your global JavaScript files bundled

These files can be:

- 📁 Served from any static file server
- 🌐 Deployed to GitHub Pages, Netlify, Vercel, etc.
- 📱 Integrated into Electron apps
- 🔧 Used as a build step in larger web projects

**Important**: Deploy all 3 files, not just the HTML file.


## License

MIT License - feel free to use in your projects!

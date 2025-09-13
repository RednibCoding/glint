# 🚀 Glint Framework Cheat Sheet

## 🏗️ Project Setup

```
my-app/
├── src/
│   ├── index.html          # Required: <glint-main></glint-main>
│   ├── main.glint          # Required: Entry component
│   └── components/         # Optional: Organize as you like
│       └── my-comp.glint
├── user.js                 # Optional: Global state files
└── package.json
```

**Build Commands:**
```bash
glint                    # Build
glint --watch           # Dev server + hot reload
```

## 📝 Component Structure

```html
<template>
  <div>{{this.message}}</div>
  <button onclick="this.handleClick()">Click</button>
</template>

<script>
  // Props (from parent)
  export let title = 'Default';
  export let count = 0;
  
  // Reactive state (triggers re-renders)
  this.message = 'Hello';
  this.isVisible = true;
  
  // Non-reactive (internal logic only)
  let apiKey = 'secret';
  const MAX_ITEMS = 100;
  
  // Methods
  function handleClick() {
    this.message = 'Clicked!';
  }
  
  // Lifecycle
  function onMounted() {
    console.log('Component ready');
  }
  
  function onUnmounted() {
    console.log('Component destroyed');
  }
</script>

<style>
  /* Scoped CSS - only affects this component */
  div { color: blue; }
</style>
```

## 🎨 Template Syntax

### Interpolation
```html
<!-- Basic -->
<div>{{this.name}}</div>
<div>Count: {{this.count}}</div>

<!-- JavaScript expressions -->
<div>{{this.firstName + ' ' + this.lastName}}</div>
<div>{{this.items.length}}</div>

<!-- Conditionals -->
{{this.isLoggedIn ? '<div>Welcome!</div>' : '<div>Login</div>'}}

<!-- Loops -->
{{this.items.map(item => '<div>' + item + '</div>').join('')}}
{{this.users.map((user, i) => '<div>' + (i+1) + '. ' + user.name + '</div>').join('')}}

<!-- Filtered loops -->
{{this.posts.filter(p => p.published).map(post => '<div>' + post.title + '</div>').join('')}}
```

### Events
```html
<button onclick="this.handleClick()">Click</button>
<input onchange="this.handleChange(event)" />
<input oninput="this.handleInput(event)" />
<form onsubmit="this.handleSubmit(event)">...</form>
<input onblur="this.handleBlur(event)" />
```

## 🔄 Global State Management

### Creating Global State (user.js)
```javascript
// Create reactive state
const userState = createState('user', {
  name: 'Anonymous',
  email: '',
  isLoggedIn: false,
  preferences: { theme: 'dark' }
});

// Create actions
const userActions = createActions('user', {
  login(name, email) {
    userState.name = name;
    userState.email = email;
    userState.isLoggedIn = true;
  },
  
  logout() {
    userState.name = 'Anonymous';
    userState.isLoggedIn = false;
  }
});

// Create global hooks (side effects)
const userHooks = createHooks('user', {
  name: (newName, oldName) => {
    document.title = `App - ${newName}`;
  },
  
  isLoggedIn: (isLoggedIn) => {
    if (isLoggedIn) api.authenticate();
  }
});
```

### Using State in Components
```html
<script>
  // Access global state & actions
  this.userState = getState('user');
  this.userActions = getActions('user');
  
  // Component-level hooks (auto-cleanup)
  function onMounted() {
    this.onStateChange('user', 'name', (newName) => {
      console.log('Name changed:', newName);
    });
  }
  
  function handleLogin() {
    this.userActions.login('John', 'john@example.com');
  }
</script>
```

## 🎣 Hooks System

### Global Hooks (in JS files)
```javascript
const appHooks = createHooks('user', {
  name: (newName) => {
    // Global side effect - runs for ALL name changes
    analytics.track('name_changed', { name: newName });
  }
});
```

### Component Hooks (auto-cleanup)
```html
<script>
  function onMounted() {
    // Component-level hooks - cleaned up automatically
    this.onStateChange('user', 'name', (newName) => {
      this.updateUI(newName); // Only affects this component
    });
    
    this.onStateChange('app', 'theme', (theme) => {
      this.applyTheme(theme);
    });
  }
</script>
```

## 🛡️ Validation & Best Practices

### ✅ Correct Patterns
```html
<script>
  // ✅ Access existing global state
  this.userState = getState('user');
  
  // ✅ Use existing global actions
  this.userActions = getActions('user');
  
  // ✅ Component-level hooks
  function onMounted() {
    this.onStateChange('user', 'name', callback);
  }
</script>
```

### ❌ Prevented Mistakes
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
> Note: Those errors will be reported by the compiler - so the build would fail.

## 📦 Quick Examples

### Simple Counter
```html
<template>
  <div>
    <h2>{{this.title}}</h2>
    <div>{{this.count}}</div>
    <button onclick="this.increment()">+</button>
  </div>
</template>

<script>
  export let title = 'Counter';
  this.count = 0;
  
  function increment() {
    this.count++;
  }
</script>
```

### Todo List with Global State
```html
<template>
  <div>
    {{this.todos.map(todo => 
      '<div>' + todo.text + ' 
       <button onclick="this.removeTodo(' + todo.id + ')">X</button>
      </div>'
    ).join('')}}
    
    <input onblur="this.handleInput(event)" />
    <button onclick="this.addTodo()">Add</button>
  </div>
</template>

<script>
  this.todoState = getState('todos');
  this.todos = this.todoState.items;
  this.newTodo = '';
  
  function handleInput(event) {
    this.newTodo = event.target.value;
  }
  
  function addTodo() {
    const actions = getActions('todos');
    actions.addTodo(this.newTodo);
    this.newTodo = '';
  }
  
  function removeTodo(id) {
    getActions('todos').removeTodo(id);
  }
</script>
```

## 🔧 API Reference

### Core Functions
```javascript
// State Management
createState(name, initialState)  // Create reactive state
getState(name)                   // Access existing state
createActions(name, actions)     // Create action functions
getActions(name)                 // Access existing actions

// Hooks
createHooks(stateName, hooks)    // Global hooks (JS files only)
this.onStateChange(state, prop, callback)  // Component hooks

// Component Lifecycle
function onMounted() {}          // Component ready
function onUnmounted() {}        // Component destroyed
```

### Component Properties
```javascript
// Props (from parent)
export let propName = defaultValue;

// Reactive state (triggers re-renders)
this.varName = value;

// Non-reactive (internal logic)
let/const/var varName = value;
```

## 🚀 Production Build

```bash
glint                    # Generates:
# build/
# ├── index.html         # Processed HTML
# ├── glint-components.js # All components
# └── user-bundle.js     # Global JS files
```

Deploy the contents of the entire `build/` directory to any static host.

---

**💡 Remember:**
- `export let` = Props from parent
- `this.var` = Reactive state  
- `let/const/var` = Non-reactive
- Global state in `.js` files only
- Component hooks auto-cleanup
- All `.glint` files auto-discovered in `src/`
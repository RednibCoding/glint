# Glint Example Project

This is an example project showcasing Glint v2.0 - a clean, React-inspired JSX component framework.

## Project Structure

```
example/
  src/
    index.html                      # Main entry point
    simple-counter.glint.js        # Counter component (no props)
    components/
      welcome-message.glint.js     # Welcome component (with props)
  build/                           # Generated files (auto-created)
  package.json
```

## Getting Started

### Development (with hot-reload)
```bash
npm run dev
```
Opens development server at `http://localhost:3000` with automatic reloading.

### Build Only
```bash
npm run build
```
Generates optimized files in the `build/` directory.

### Serve Built Files
```bash
npm run serve
```
Serves the built project using Python's HTTP server.

### Clean Build
```bash
npm run clean
```
Removes the `build/` directory.

## Features Demonstrated

- **Function Components**: Clean JSX syntax with template literals
- **State Management**: `useState` hook for reactive state
- **Event Handling**: `useHandlers` for clean event binding
- **Props System**: Attribute-based props with automatic camelCase conversion
- **Shadow DOM**: Component style isolation
- **Hot Reload**: Development server with automatic refresh

## Component Examples

### Simple Counter (No Props)
```javascript
function SimpleCounter() {
    const [count, setCount] = useState(0);
    
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
    
    useHandlers({ increment, decrement, reset });
    
    const jsx = `
        <style>/* component styles */</style>
        <button onclick="decrement">-</button>
        <span>${count}</span>
        <button onclick="increment">+</button>
        <button onclick="reset">Reset</button>
    `;
    
    return jsx;
}
```

### Welcome Message (With Props)
```html
<welcome-message name="Alice" age="25"></welcome-message>
<welcome-message name="Bob"></welcome-message>
```

## Glint v2.0 Highlights

- **~340 LOC**: Entire framework in a single compact file
- **JSX-like**: Template literals with familiar syntax
- **React-inspired**: useState hooks and function components
- **Web Standards**: Built on Custom Elements and Shadow DOM
- **Zero Config**: No build tools, just run and go
- **Hot Reload**: Built-in development server
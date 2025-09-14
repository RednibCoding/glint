# Glint ✨

> A declarative JavaScript UI framework with built-in reactive state management and comprehensive widget library.

Glint brings the power of declarative, widget-based UI development to the web. Inspired by Flutter's elegant patterns, Glint lets you build reactive user interfaces using familiar concepts like StatefulWidget and setState(), while staying lightweight and optimized specifically for web development. Everything is a widget, state updates are automatic, and the result is clean, maintainable code that feels natural to write.

## 🚀 Features

- **Flutter-Inspired Architecture**: StatelessWidget, StatefulWidget, and declarative UI patterns
- **Reactive State Management**: Built-in `setState()` with automatic re-rendering
- **Comprehensive Widget Library**: 23+ production-ready widgets across all categories
- **Zero Dependencies**: Pure JavaScript implementation, no external libraries
- **Smooth Animations**: Built-in transitions and animations for enhanced UX
- **Virtual DOM**: Efficient Element-based virtual DOM system
- **TypeScript Ready**: Clean API surface ready for TypeScript definitions

## 📦 Widget Library

### Basic Widgets
- **Text** - Styled text rendering with full typography support
- **Button** - Interactive buttons with hover/active states and custom styling  
- **Container** - Layout container with padding, margin, colors, and borders

### Layout Widgets
- **Column** - Vertical flex layout with alignment options
- **Row** - Horizontal flex layout with spacing controls
- **Center** - Centers child widgets
- **Expanded** - Fills available space in flex layouts
- **Stack** - Overlapping/absolute positioning with alignment controls
- **Positioned** - Absolute positioning helper for Stack children
- **SizedBox** - Fixed-size container for spacing and sizing constraints

### Display Widgets
- **Icon** - Emoji and text-based icons
- **Card** - Elevated containers with shadows
- **Divider** - Visual separators
- **Spacer** - Flexible spacing
- **CircularProgressIndicator** - Loading spinners with CSS animations
- **LinearProgressIndicator** - Progress bars with determinate/indeterminate modes
- **Image** - Image display with error handling

### Navigation Widgets
- **AppBar** - Top navigation bars with titles and actions
- **Drawer** - Side navigation with smooth slide animations
- **BottomNavigationBar** - Tab-based bottom navigation
- **ListTile** - Structured list items with leading/trailing elements

### Input Widgets
- **TextField** - Text input with validation and styling support

## 🏗️ Architecture

```
glint/
├── glint.js              # Main framework exports
├── framework/            # Core framework classes
│   ├── widget.js         # Widget base classes
│   ├── element.js        # Virtual DOM system
│   └── app.js           # Application lifecycle
└── widgets/             # Widget implementations
    ├── basic/           # Fundamental UI elements
    ├── layout/          # Layout and positioning
    ├── display/         # Visual components
    ├── navigation/      # Navigation elements
    └── input/           # Form controls
```

## 💻 Quick Start

### Basic Counter App

```javascript
import { StatefulWidget, runApp, Column, Text, Button } from './glint/glint.js';

class CounterApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  build() {
    return new Column({
      mainAxisAlignment: 'center',
      children: [
        new Text(`Count: ${this.state.count}`, {
          style: { fontSize: '24px', fontWeight: 'bold' }
        }),
        new Button({
          onPressed: () => this.increment(),
          child: new Text('Increment')
        })
      ]
    });
  }
}

runApp(new CounterApp());
```

### Drawer Navigation

```javascript
import { Drawer, ListTile, Icon, Divider } from './glint/glint.js';

new Drawer({
  onOverlayTap: () => closeDrawer(),
  animationDuration: 300,
  children: [
    new ListTile({
      leading: new Icon('📊', { size: 24 }),
      title: 'Dashboard',
      onTap: () => navigate('dashboard')
    }),
    new Divider(),
    new ListTile({
      leading: new Icon('⚙️', { size: 24 }),  
      title: 'Settings',
      onTap: () => navigate('settings')
    })
  ]
})
```

## 🎯 Core Concepts

### Widget System
Glint uses Flutter's widget paradigm where everything is a widget. Widgets are immutable descriptions of UI that get rendered into DOM elements.

### State Management
- **StatelessWidget**: Immutable widgets that don't change
- **StatefulWidget**: Widgets with mutable state using `setState()`
- **Reactive Updates**: Automatic re-rendering when state changes

### Element System  
Virtual DOM implementation that efficiently updates only changed parts of the UI.

### Layout System
Flexbox-based layout system with familiar Flutter alignment and spacing options.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server with live examples
npm run dev

# Build framework for production
npm run build

# Preview built version
npm run preview
```

### Project Structure

```
/
├── glint/              # 🎯 The Glint Framework
│   ├── glint.js        # Main exports
│   ├── framework/      # Core classes
│   └── widgets/        # Complete widget library
├── src/                # 🚀 Demo Application  
│   ├── main.js         # Default counter example
│   ├── drawer-example.js
│   ├── button-example.js
│   └── ...             # Widget demonstrations
├── index.html          # Examples browser
└── package.json        # Build configuration
```

## 📖 Examples

The `/src` directory contains comprehensive examples for every widget:

- **Text & Button Examples**: Typography and interaction patterns
- **Layout Examples**: Column, Row, Center, and Expanded demonstrations  
- **Navigation Examples**: AppBar, Drawer, and BottomNavigationBar
- **Display Examples**: Cards, Progress Indicators, and visual elements
- **Form Examples**: TextField and input validation

Visit `http://localhost:3000` to browse all examples interactively.

## 🎨 Styling

Glint widgets accept standard CSS properties through the `style` prop:

```javascript
new Text('Hello World', {
  style: {
    fontSize: '18px',
    color: '#2196F3', 
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

new Container({
  padding: 20,
  margin: 16,
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  border: '1px solid #ddd',
  child: new Text('Styled Container')
})
```

## 🌟 Why Glint?

- **Familiar**: If you know Flutter, you already know Glint
- **Lightweight**: Zero dependencies, ~8KB minified
- **Complete**: Production-ready widget library out of the box
- **Modern**: ES6 modules, clean architecture, extensible design
- **Fast**: Efficient virtual DOM with minimal re-renders
- **Flexible**: Easy to extend with custom widgets

## 📄 License

MIT License - feel free to use in personal and commercial projects.

---

Built with ❤️ for developers who love Flutter's declarative UI paradigm.
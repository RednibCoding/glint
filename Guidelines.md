# Developer Guidelines for Glint Framework

## Project Overview

**Glint** is a declarative JavaScript UI framework inspired by Flutter's widget-based architecture. It brings Flutter's elegant patterns to web development with a pure JavaScript implementation.

### Core Philosophy
- **Everything is a widget** - UI is built using composable widget classes
- **Declarative UI** - Describe what the UI should look like, not how to build it
- **Reactive state management** - Automatic re-rendering when state changes via `setState()`
- **Flutter-inspired patterns** - Familiar concepts for Flutter developers

## Architecture

```
glint/
├── framework/           # Core framework classes
│   ├── widget.js       # StatelessWidget, StatefulWidget base classes
│   ├── element.js      # Virtual DOM system
│   └── app.js         # Application lifecycle (runApp)
└── widgets/           # Complete widget library
    ├── basic/         # Text, Button, Container
    ├── layout/        # Column, Row, Stack, Center, etc.
    ├── display/       # Card, Icon, Divider, Progress indicators
    ├── navigation/    # AppBar, Drawer, BottomNavigationBar
    └── input/         # TextField, form controls
```

## Do's ✅

### Widget Development
- **Extend proper base classes**: Use `StatelessWidget` for immutable widgets, `StatefulWidget` for widgets with state
- **Follow Flutter patterns**: Use `build()` methods, `setState()` for state updates
- **Use Element for DOM**: Always return `Element` instances from `build()` methods
- **Consistent prop handling**: Destructure props with defaults in `build()` method
- **Proper state initialization**: Initialize state in constructor for StatefulWidget

### Naming Conventions
- **Widget classes**: PascalCase (e.g., `CircularProgressIndicator`)
- **Props**: camelCase with descriptive names
- **State properties**: camelCase, descriptive
- **Methods**: camelCase, action-oriented (e.g., `handleClick`, `updateValue`)

### Code Structure
```javascript
// StatelessWidget example
export class MyWidget extends StatelessWidget {
  build() {
    const {
      children = [],
      style = {},
      className,
      ...otherProps
    } = this.props;
    
    return new Element('div', {
      className: `my-widget ${className || ''}`.trim(),
      style: { ...defaultStyle, ...style },
      ...otherProps
    }, children);
  }
}

// StatefulWidget example
export class MyStatefulWidget extends StatefulWidget {
  constructor(props = {}) {
    super(props);
    this.state = { value: 0 };
  }
  
  handleUpdate() {
    this.setState({ value: this.state.value + 1 });
  }
  
  build() {
    // Implementation here
  }
}
```

### Styling Approach
- **CSS-in-JS**: Use inline styles via `style` prop
- **Responsive design**: Support both pixel and percentage values
- **Theme consistency**: Use consistent color palettes and spacing
- **Transitions**: Include smooth CSS transitions for interactive elements

### Props Design
- **Flexible children**: Support both single child and array of children
- **Sensible defaults**: Provide reasonable default values
- **Style merging**: Allow style overrides while maintaining base styles
- **Event handlers**: Use descriptive callback names (e.g., `onPressed`, `onChanged`)

## Don'ts ❌

### Widget Development
- **Don't manipulate DOM directly**: Always use Element abstraction
- **Don't use jQuery or other DOM libraries**: Stick to pure JavaScript and Glint patterns
- **Don't create widgets in build() methods**: This causes unnecessary re-creation
- **Don't mutate state directly**: Always use `setState()` for state changes
- **Don't mix imperative and declarative patterns**: Keep consistent with Flutter-style declarative approach

### Performance
- **Don't create new objects in render**: Use constants or class properties for static data
- **Don't perform expensive operations in build()**: Use lifecycle methods or memoization
- **Don't ignore key props**: Consider implementing widget keys for list optimization

### API Design
- **Don't use inconsistent naming**: Follow Flutter conventions where applicable
- **Don't make props required without defaults**: Provide sensible fallbacks
- **Don't expose internal implementation**: Keep APIs clean and focused on use cases

## Framework-Specific Patterns

### State Management
```javascript
// Correct state update
this.setState({ count: this.state.count + 1 });

// Incorrect - direct mutation
this.state.count += 1; // ❌ Don't do this
```

### Widget Composition
```javascript
// Correct composition
new Column({
  children: [
    new Text('Header'),
    new Container({
      child: new Text('Content')
    })
  ]
})

// Avoid deeply nested anonymous functions
onPressed: () => this.handlePress() // ✅
onPressed: () => { /* complex logic */ } // ❌
```

### CSS and Styling
```javascript
// Preferred approach
const buttonStyle = {
  padding: '12px 24px',
  borderRadius: '6px',
  backgroundColor: '#007bff',
  transition: 'background-color 0.2s'
};

// Support style merging
style: { ...buttonStyle, ...this.props.style }
```

## Common Patterns

### Layout Widgets
- Use flexbox patterns consistently
- Support alignment properties (mainAxisAlignment, crossAxisAlignment)
- Implement gap/spacing properties for child spacing

### Interactive Widgets
- Include hover states and transitions
- Support disabled states
- Implement proper focus handling
- Use semantic HTML elements

### Animation Support
- Use CSS transitions over JavaScript animations
- Support configurable animation durations
- Implement proper cleanup in lifecycle methods

## Testing Considerations

- Widgets should be pure functions of their props and state
- Test state changes through public methods
- Verify proper DOM structure in output
- Test edge cases with empty children or missing props

## Examples Directory

The `/src` directory contains comprehensive examples:
- Each widget has a dedicated example file
- Examples demonstrate real-world usage patterns
- Focus on practical applications over basic demos

## Framework Extensions

When adding new widgets:
1. Follow existing widget patterns
2. Add comprehensive examples
3. Update README.md widget list
4. Export from appropriate barrel files
5. Consider accessibility requirements

Remember: Glint aims to be Flutter for the web - keep that mental model when designing and implementing features.
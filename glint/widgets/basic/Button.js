import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Button widget for user interactions
export class Button extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const { 
      child,
      onPressed,
      style = {},
      hoverStyle = {},
      className,
      disabled = false,
      ...otherProps 
    } = this.props;

    const buttonStyle = {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: disabled ? '#cccccc' : '#007bff',
      color: disabled ? '#666666' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
      transition: 'background-color 0.2s',
      ...style
    };

    const clickHandler = (e) => {
      if (!disabled && onPressed) {
        onPressed(e);
      }
    };

    // Create unique class name for this button instance to avoid CSS conflicts
    const buttonId = `glint-button-${Math.random().toString(36).substring(2, 11)}`;
    
    // Inject hover styles if not already present
    if (!document.querySelector('#glint-button-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'glint-button-styles';
      document.head.appendChild(styleSheet);
    }
    
    // Determine hover color - priority: hoverStyle prop > hardcoded default
    let hoverColor;
    if (hoverStyle.backgroundColor) {
      // User explicitly provided hover color
      hoverColor = hoverStyle.backgroundColor;
    } else {
      // Hardcoded default (later will come from theme system)
      hoverColor = '#0056b3';
    }
    
    // Build complete hover style (merge user hoverStyle with default background)
    const completeHoverStyle = {
      backgroundColor: hoverColor,
      ...hoverStyle // Allow user to override other properties like color, border, etc.
    };
    
    // Generate CSS for this button's hover state
    const existingStyles = document.querySelector('#glint-button-styles');
    let hoverCss = `.${buttonId}:hover:not(:disabled) {\n`;
    
    // Apply all hover style properties
    Object.entries(completeHoverStyle).forEach(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      hoverCss += `  ${cssProperty}: ${value} !important;\n`;
    });
    
    hoverCss += '}\n';
    existingStyles.textContent += hoverCss;

    return new Element('button', {
      style: buttonStyle,
      className: `${className || ''} ${buttonId}`.trim(),
      onClick: clickHandler,
      disabled,
      ...otherProps
    }, child ? (Array.isArray(child) ? child : [child]) : []);
  }
}
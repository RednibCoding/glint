import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Button widget for user interactions
export class Button extends StatelessWidget {
  constructor(text, props = {}) {
    super(props);
    this.text = text;
  }

  build() {
    const { 
      onPressed,
      style = {},
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

    return new Element('button', {
      style: buttonStyle,
      className,
      onClick: clickHandler,
      onMouseOver: (e) => {
        if (!disabled) {
          e.target.style.backgroundColor = style.backgroundColor || '#0056b3';
        }
      },
      onMouseOut: (e) => {
        if (!disabled) {
          e.target.style.backgroundColor = style.backgroundColor || '#007bff';
        }
      },
      disabled,
      ...otherProps
    }, [this.text]);
  }
}
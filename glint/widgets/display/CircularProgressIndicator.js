import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// CircularProgressIndicator widget for loading states
export class CircularProgressIndicator extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      size = 40,
      strokeWidth = 4,
      color = '#007bff',
      backgroundColor = '#e1e5e9',
      style = {},
      ...otherProps
    } = this.props;

    // Inject CSS animation if not already present
    if (!document.querySelector('#glint-spinner-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'glint-spinner-styles';
      styleSheet.textContent = `
        @keyframes glint-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .glint-spinner {
          border-radius: 50%;
          animation: glint-spin 1s linear infinite;
        }
      `;
      document.head.appendChild(styleSheet);
    }

    const containerStyle = {
      width: typeof size === 'number' ? `${size}px` : size,
      height: typeof size === 'number' ? `${size}px` : size,
      display: 'inline-block',
      borderRadius: '50%',
      border: `${strokeWidth}px solid ${backgroundColor}`,
      borderTop: `${strokeWidth}px solid ${color}`,
      borderRight: `${strokeWidth}px solid ${color}`,
      borderBottom: `${strokeWidth}px solid ${color}`,
      borderLeft: `${strokeWidth}px solid transparent`,
      animation: 'glint-spin 1s linear infinite',
      ...style
    };

    return new Element('div', {
      style: containerStyle,
      className: 'glint-spinner',
      ...otherProps
    });
  }
}
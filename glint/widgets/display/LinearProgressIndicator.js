import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// LinearProgressIndicator widget for loading bars
export class LinearProgressIndicator extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      value, // 0.0 to 1.0, undefined for indeterminate
      height = 4,
      color = '#007bff',
      backgroundColor = '#e1e5e9',
      style = {},
      ...otherProps
    } = this.props;

    const containerStyle = {
      width: '100%',
      height: typeof height === 'number' ? `${height}px` : height,
      backgroundColor,
      borderRadius: typeof height === 'number' ? `${height / 2}px` : '2px',
      overflow: 'hidden',
      position: 'relative',
      ...style
    };

    const progressStyle = {
      height: '100%',
      backgroundColor: color,
      borderRadius: 'inherit',
      transition: value !== undefined ? 'width 0.3s ease' : 'none',
      width: value !== undefined ? `${value * 100}%` : '100%',
      ...(value === undefined && {
        animation: 'glint-progress 2s ease-in-out infinite',
        transformOrigin: 'left center'
      })
    };

    // Inject CSS animation for indeterminate progress
    if (value === undefined && !document.querySelector('#glint-progress-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'glint-progress-styles';
      styleSheet.textContent = `
        @keyframes glint-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    return new Element('div', {
      style: containerStyle,
      ...otherProps
    }, [
      new Element('div', { style: progressStyle })
    ]);
  }
}
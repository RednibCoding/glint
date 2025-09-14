import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// AppBar widget for application header
export class AppBar extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      title = '',
      leading,
      actions = [],
      backgroundColor = '#007bff',
      foregroundColor = '#ffffff',
      elevation = 4,
      centerTitle = true,
      height = 56,
      style = {},
      ...otherProps
    } = this.props;

    const shadowIntensity = Math.min(elevation * 0.1, 0.3);
    const shadowBlur = elevation * 2;

    const appBarStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: typeof height === 'number' ? `${height}px` : height,
      backgroundColor,
      color: foregroundColor,
      padding: '0 16px',
      boxShadow: `0 ${elevation}px ${shadowBlur}px rgba(0, 0, 0, ${shadowIntensity})`,
      position: 'relative',
      zIndex: 1000,
      ...style
    };

    const titleStyle = {
      fontSize: '20px',
      fontWeight: '500',
      margin: 0,
      ...(centerTitle && { 
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
      })
    };

    const actionsStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };

    return new Element('header', {
      style: appBarStyle,
      ...otherProps
    }, [
      leading || new Element('div'), // Empty div if no leading widget
      new Element('h1', { style: titleStyle }, [title]),
      new Element('div', { style: actionsStyle }, actions)
    ]);
  }
}
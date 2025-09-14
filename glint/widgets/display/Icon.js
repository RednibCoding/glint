import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Icon widget for displaying icons (using text/unicode icons)
export class Icon extends StatelessWidget {
  constructor(icon, props = {}) {
    super(props);
    this.icon = icon;
  }

  build() {
    const {
      size = 24,
      color = '#333333',
      style = {},
      ...otherProps
    } = this.props;

    const iconStyle = {
      fontSize: typeof size === 'number' ? `${size}px` : size,
      color,
      display: 'inline-block',
      lineHeight: 1,
      fontFamily: 'inherit',
      ...style
    };

    return new Element('span', {
      style: iconStyle,
      ...otherProps
    }, [this.icon]);
  }
}
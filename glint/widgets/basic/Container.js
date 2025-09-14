import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Container widget for layout and styling
export class Container extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const { 
      child, 
      width, 
      height, 
      padding,
      margin,
      backgroundColor,
      borderRadius,
      border,
      style = {},
      className,
      ...otherProps 
    } = this.props;

    const containerStyle = {
      display: 'block',
      boxSizing: 'border-box',
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
      ...(padding && { padding: typeof padding === 'number' ? `${padding}px` : padding }),
      ...(margin && { margin: typeof margin === 'number' ? `${margin}px` : margin }),
      ...(backgroundColor && { backgroundColor }),
      ...(borderRadius && { borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius }),
      ...(border && { border }),
      ...style
    };

    return new Element('div', {
      style: containerStyle,
      className,
      ...otherProps
    }, child ? [child] : []);
  }
}
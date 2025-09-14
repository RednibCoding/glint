import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Divider widget for visual separation
export class Divider extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      height = 1,
      color = '#e1e5e9',
      thickness,
      indent = 0,
      endIndent = 0,
      style = {},
      ...otherProps
    } = this.props;

    const dividerStyle = {
      height: typeof (thickness || height) === 'number' ? `${thickness || height}px` : (thickness || height),
      backgroundColor: color,
      border: 'none',
      margin: '8px 0',
      marginLeft: typeof indent === 'number' ? `${indent}px` : indent,
      marginRight: typeof endIndent === 'number' ? `${endIndent}px` : endIndent,
      ...style
    };

    return new Element('hr', {
      style: dividerStyle,
      ...otherProps
    });
  }
}
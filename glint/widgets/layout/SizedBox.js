import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// SizedBox widget for creating fixed-size containers or spacing
export class SizedBox extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      width,
      height,
      child,
      style = {},
      ...otherProps
    } = this.props;

    // Create the base style with dimensions
    const sizedBoxStyle = {
      boxSizing: 'border-box',
      ...style
    };

    // Set width if provided
    if (width !== undefined) {
      if (typeof width === 'number') {
        sizedBoxStyle.width = `${width}px`;
      } else {
        sizedBoxStyle.width = width;
      }
    }

    // Set height if provided
    if (height !== undefined) {
      if (typeof height === 'number') {
        sizedBoxStyle.height = `${height}px`;
      } else {
        sizedBoxStyle.height = height;
      }
    }

    // If no child is provided, create an empty container for spacing
    const content = child || [];

    return new Element('div', {
      style: sizedBoxStyle,
      ...otherProps
    }, Array.isArray(content) ? content : [content]);
  }

  // Static method for creating square SizedBox
  static square(size, props = {}) {
    return new SizedBox({
      width: size,
      height: size,
      ...props
    });
  }

  // Static method for creating spacing (empty SizedBox)
  static spacing(width, height) {
    return new SizedBox({
      width: width,
      height: height
    });
  }

  // Static method for horizontal spacing
  static width(width) {
    return new SizedBox({ width });
  }

  // Static method for vertical spacing
  static height(height) {
    return new SizedBox({ height });
  }
}
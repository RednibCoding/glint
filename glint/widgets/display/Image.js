import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Image widget for displaying images
export class Image extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      src,
      alt = '',
      width,
      height,
      fit = 'cover', // cover, contain, fill, scale-down, none
      style = {},
      ...otherProps
    } = this.props;

    const imageStyle = {
      display: 'block',
      objectFit: fit,
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
      ...style
    };

    return new Element('img', {
      src,
      alt,
      style: imageStyle,
      ...otherProps
    });
  }
}
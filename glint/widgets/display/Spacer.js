import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Spacer widget for adding space between elements
export class Spacer extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      flex = 1,
      width,
      height,
      style = {},
      ...otherProps
    } = this.props;

    const spacerStyle = {
      flex: flex.toString(),
      ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
      ...style
    };

    return new Element('div', {
      style: spacerStyle,
      ...otherProps
    });
  }
}
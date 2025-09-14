import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Expanded widget for flexible layouts
export class Expanded extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const { 
      child,
      flex = 1,
      style = {},
      className,
      ...otherProps 
    } = this.props;

    const expandedStyle = {
      flex: flex,
      ...style
    };

    return new Element('div', {
      style: expandedStyle,
      className,
      ...otherProps
    }, [child]);
  }
}
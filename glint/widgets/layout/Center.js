import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Center widget for centering content
export class Center extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const { 
      child,
      style = {},
      className,
      ...otherProps 
    } = this.props;

    const centerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style
    };

    return new Element('div', {
      style: centerStyle,
      className,
      ...otherProps
    }, [child]);
  }
}
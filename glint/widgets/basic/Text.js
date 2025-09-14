import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Text widget for displaying text
export class Text extends StatelessWidget {
  constructor(text, props = {}) {
    super(props);
    this.text = text;
  }

  build() {
    const { style = {}, className, ...otherProps } = this.props;
    
    const defaultStyle = {
      fontSize: '16px',
      color: '#000000',
      fontFamily: 'inherit',
      ...style
    };

    return new Element('span', {
      style: defaultStyle,
      className,
      ...otherProps
    }, [this.text]);
  }
}
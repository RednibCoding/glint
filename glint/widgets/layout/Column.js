import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Column widget for vertical layout
export class Column extends StatelessWidget {
  constructor(propsOrChildren = {}) {
    // Handle both patterns: new Column([...]) and new Column({ children: [...] })
    if (Array.isArray(propsOrChildren)) {
      super({ children: propsOrChildren });
    } else {
      super(propsOrChildren);
    }
  }

  build() {
    const { 
      children = [],
      mainAxisAlignment = 'start', // start, center, end, spaceBetween, spaceAround
      crossAxisAlignment = 'stretch', // start, center, end, stretch
      gap = 0,
      style = {},
      className,
      ...otherProps 
    } = this.props;

    const flexStyles = {
      display: 'flex',
      flexDirection: 'column',
      ...(gap && { gap: typeof gap === 'number' ? `${gap}px` : gap }),
      ...style
    };

    // Map Flutter-like alignment to CSS
    switch (mainAxisAlignment) {
      case 'center':
        flexStyles.justifyContent = 'center';
        break;
      case 'end':
        flexStyles.justifyContent = 'flex-end';
        break;
      case 'spaceBetween':
        flexStyles.justifyContent = 'space-between';
        break;
      case 'spaceAround':
        flexStyles.justifyContent = 'space-around';
        break;
      case 'spaceEvenly':
        flexStyles.justifyContent = 'space-evenly';
        break;
      default:
        flexStyles.justifyContent = 'flex-start';
    }

    switch (crossAxisAlignment) {
      case 'center':
        flexStyles.alignItems = 'center';
        break;
      case 'end':
        flexStyles.alignItems = 'flex-end';
        break;
      case 'stretch':
        flexStyles.alignItems = 'stretch';
        break;
      default:
        flexStyles.alignItems = 'flex-start';
    }

    return new Element('div', {
      style: flexStyles,
      className,
      ...otherProps
    }, children);
  }
}
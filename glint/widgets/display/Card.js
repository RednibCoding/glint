import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Card widget for material design cards
export class Card extends StatelessWidget {
  constructor(propsOrChildren = {}) {
    // Handle both patterns: new Card([...]) and new Card({ children: [...] }) and new Card({ child: widget })
    if (Array.isArray(propsOrChildren)) {
      super({ children: propsOrChildren });
    } else {
      super(propsOrChildren);
    }
  }

  build() {
    const {
      child,
      children = [],
      elevation = 1,
      borderRadius = 8,
      margin = 8,
      padding = 16,
      color = '#ffffff',
      style = {},
      ...otherProps
    } = this.props;

    // Handle both child and children patterns
    const cardChildren = child ? [child] : children;

    const shadowIntensity = Math.min(elevation * 0.1, 0.3);
    const shadowBlur = elevation * 2;
    const shadowSpread = elevation * 0.5;

    const cardStyle = {
      backgroundColor: color,
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      margin: typeof margin === 'number' ? `${margin}px` : margin,
      padding: typeof padding === 'number' ? `${padding}px` : padding,
      boxShadow: `0 ${elevation}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, ${shadowIntensity})`,
      ...style
    };

    return new Element('div', {
      style: cardStyle,
      ...otherProps
    }, cardChildren);
  }
}
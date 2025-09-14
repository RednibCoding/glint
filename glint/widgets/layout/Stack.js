import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Stack widget for overlapping/absolute positioning of children - Flutter-inspired
export class Stack extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const { 
      children = [],
      alignment = 'topLeft', // topLeft, topCenter, topRight, centerLeft, center, centerRight, bottomLeft, bottomCenter, bottomRight
      fit = 'loose', // loose, expand, passthrough
      clipBehavior = 'hardEdge', // none, hardEdge, antiAlias
      textDirection = 'ltr', // ltr, rtl
      ...otherProps 
    } = this.props;

    // Convert alignment to CSS values
    const getAlignmentStyles = (alignment) => {
      const alignments = {
        topLeft: { justifyContent: 'flex-start', alignItems: 'flex-start' },
        topCenter: { justifyContent: 'flex-start', alignItems: 'center' },
        topRight: { justifyContent: 'flex-start', alignItems: 'flex-end' },
        centerLeft: { justifyContent: 'center', alignItems: 'flex-start' },
        center: { justifyContent: 'center', alignItems: 'center' },
        centerRight: { justifyContent: 'center', alignItems: 'flex-end' },
        bottomLeft: { justifyContent: 'flex-end', alignItems: 'flex-start' },
        bottomCenter: { justifyContent: 'flex-end', alignItems: 'center' },
        bottomRight: { justifyContent: 'flex-end', alignItems: 'flex-end' }
      };
      return alignments[alignment] || alignments.topLeft;
    };

    const alignmentStyles = getAlignmentStyles(alignment);

    const stackStyle = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      ...alignmentStyles,
      width: fit === 'expand' ? '100%' : 'auto',
      height: fit === 'expand' ? '100%' : 'auto',
      overflow: clipBehavior === 'none' ? 'visible' : 'hidden',
      direction: textDirection,
      ...otherProps.style
    };

    return new Element('div', {
      ...otherProps,
      style: stackStyle
    }, children); // Let children render themselves normally
  }
}

// Helper widget for positioned children - similar to Flutter's Positioned widget
export class Positioned extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const { 
      child,
      top,
      bottom,
      left,
      right,
      width,
      height,
      ...otherProps 
    } = this.props;

    const positionedStyle = {
      position: 'absolute',
      ...(top !== undefined && { top: typeof top === 'number' ? `${top}px` : top }),
      ...(bottom !== undefined && { bottom: typeof bottom === 'number' ? `${bottom}px` : bottom }),
      ...(left !== undefined && { left: typeof left === 'number' ? `${left}px` : left }),
      ...(right !== undefined && { right: typeof right === 'number' ? `${right}px` : right }),
      ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
      ...otherProps.style
    };

    return new Element('div', {
      ...otherProps,
      style: positionedStyle
    }, child ? [child] : []);
  }
}
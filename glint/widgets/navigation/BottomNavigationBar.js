import { StatefulWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// BottomNavigationBar widget for bottom navigation
export class BottomNavigationBar extends StatefulWidget {
  constructor(props = {}) {
    super(props);
    this.state = { currentIndex: props.currentIndex || 0 };
  }

  build() {
    const {
      items = [],
      onTap,
      backgroundColor = '#ffffff',
      selectedItemColor = '#007bff',
      unselectedItemColor = '#757575',
      elevation = 8,
      height = 80,
      style = {},
      ...otherProps
    } = this.props;

    const shadowIntensity = Math.min(elevation * 0.1, 0.3);
    const shadowBlur = elevation * 2;

    const navBarStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: typeof height === 'number' ? `${height}px` : height,
      backgroundColor,
      borderTop: '1px solid #e1e5e9',
      boxShadow: `0 -${elevation}px ${shadowBlur}px rgba(0, 0, 0, ${shadowIntensity})`,
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      ...style
    };

    const itemStyle = (index) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      cursor: 'pointer',
      padding: '8px',
      color: index === this.state.currentIndex ? selectedItemColor : unselectedItemColor,
      transition: 'color 0.2s'
    });

    const iconStyle = {
      fontSize: '24px',
      marginBottom: '4px'
    };

    const labelStyle = {
      fontSize: '12px',
      textAlign: 'center'
    };

    return new Element('nav', {
      style: navBarStyle,
      ...otherProps
    }, items.map((item, index) => 
      new Element('div', {
        style: itemStyle(index),
        onClick: () => {
          this.setState({ currentIndex: index });
          if (onTap) onTap(index);
        }
      }, [
        new Element('div', { style: iconStyle }, [item.icon || '']),
        new Element('div', { style: labelStyle }, [item.label || ''])
      ])
    ));
  }
}
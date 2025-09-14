import { StatelessWidget } from '../../framework/widget.js';
import { Element } from '../../framework/element.js';

// Drawer widget for side navigation with smooth animations
export class Drawer extends StatelessWidget {
  constructor(props = {}) {
    super(props);
  }

  build() {
    const {
      children = [],
      width = 280,
      backgroundColor = '#ffffff',
      elevation = 16,
      overlay = true,
      onOverlayTap,
      overlayColor = 'rgba(0, 0, 0, 0.5)',
      animationDuration = 300,
      style = {},
      ...otherProps
    } = this.props;

    const shadowIntensity = Math.min(elevation * 0.15, 0.4);
    const shadowBlur = elevation * 3;

    const drawerStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: typeof width === 'number' ? `${width}px` : width,
      backgroundColor,
      boxShadow: `${elevation}px 0 ${shadowBlur}px rgba(0, 0, 0, ${shadowIntensity})`,
      zIndex: 1200,
      overflowY: 'auto',
      transform: 'translateX(-100%)',
      transition: `transform ${animationDuration}ms cubic-bezier(0.25, 0.8, 0.25, 1)`,
      ...style
    };

    const overlayStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: overlayColor,
      zIndex: 1100,
      opacity: 0,
      transition: `opacity ${animationDuration}ms ease`
    };

    // Use setTimeout to trigger animation after DOM mount
    setTimeout(() => {
      const drawerElement = document.querySelector('[data-drawer="true"]');
      const overlayElement = document.querySelector('[data-drawer-overlay="true"]');
      
      if (drawerElement) {
        drawerElement.style.transform = 'translateX(0)';
      }
      if (overlayElement) {
        overlayElement.style.opacity = '1';
      }
    }, 10);

    // If overlay is enabled, wrap both overlay and drawer in a container
    if (overlay) {
      return new Element('div', {}, [
        // Overlay
        new Element('div', {
          'data-drawer-overlay': 'true',
          style: overlayStyle,
          onClick: onOverlayTap || (() => {})
        }),
        // Drawer
        new Element('aside', {
          'data-drawer': 'true',
          style: drawerStyle,
          ...otherProps
        }, children)
      ]);
    } else {
      // Just the drawer without overlay
      return new Element('aside', {
        'data-drawer': 'true',
        style: drawerStyle,
        ...otherProps
      }, children);
    }
  }
}
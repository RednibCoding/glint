import { Widget } from './widget.js';

// App class manages the root widget and rendering
export class App {
  constructor(rootWidget, container) {
    this.rootWidget = rootWidget;
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.mounted = false;
  }

  // Start the app
  run() {
    if (!this.container) {
      throw new Error('Container not found');
    }

    this.rootWidget.mount(this.container);
    this.mounted = true;
    
    console.log('🚀 Glint app started');
    return this;
  }

  // Update the root widget
  update(newRootWidget) {
    if (this.mounted) {
      this.rootWidget = this.rootWidget.update(newRootWidget);
    }
  }

  // Stop the app
  stop() {
    if (this.mounted) {
      this.rootWidget.unmount();
      this.mounted = false;
    }
  }
}

// Utility function to create and run an app
export function runApp(widget, container = '#app') {
  const app = new App(widget, container);
  
  // Auto-start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.run());
  } else {
    app.run();
  }
  
  return app;
}
import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Button } from '../glint/widgets/basic/Button.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { Row } from '../glint/widgets/layout/Row.js';
import { Drawer } from '../glint/widgets/navigation/Drawer.js';
import { ListTile } from '../glint/widgets/navigation/ListTile.js';
import { Divider } from '../glint/widgets/display/Divider.js';
import { Icon } from '../glint/widgets/display/Icon.js';

class DrawerExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { 
      isDrawerOpen: false,
      selectedPage: 'Dashboard',
      message: 'Click the menu button to open the drawer!'
    };
  }

  toggleDrawer() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  }

  selectPage(pageName) {
    this.setState({ 
      selectedPage: pageName,
      isDrawerOpen: false,
      message: `Navigated to ${pageName}`
    });
  }

  build() {
    return new Container({
      style: { position: 'relative', height: '100vh' },
      child: new Column([
        // Header bar
        new Container({
          padding: 16,
          backgroundColor: '#2196F3',
          child: new Row({
            mainAxisAlignment: 'spaceBetween',
            children: [
              new Button({
                child: new Text('☰'),
                style: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  padding: '8px'
                },
                onPressed: () => this.toggleDrawer()
              }),
              new Text('Drawer Example', {
                style: { 
                  color: 'white', 
                  fontSize: '20px', 
                  fontWeight: 'bold' 
                }
              }),
              new Container({ width: 40 }) // Spacer for centering
            ]
          })
        }),

        // Main content
        new Container({
          padding: 20,
          style: { flex: 1 },
          child: new Column({
            gap: 20,
            children: [
              new Text(`Current Page: ${this.state.selectedPage}`, {
                style: { fontSize: '24px', fontWeight: 'bold' }
              }),
              new Container({
                padding: 20,
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                border: '1px solid #dee2e6',
                child: new Text(this.state.message, {
                  style: { fontSize: '16px', textAlign: 'center' }
                })
              }),
              new Text('💡 The drawer slides in smoothly with animation', {
                style: { 
                  fontSize: '14px', 
                  color: '#666',
                  fontStyle: 'italic'
                }
              }),
              new Text('• Click the menu button (☰) to open/close', {
                style: { fontSize: '14px', color: '#666' }
              }),
              new Text('• Select menu items to navigate', {
                style: { fontSize: '14px', color: '#666' }
              }),
              new Text('• Smooth slide-in/out animations with overlay fade', {
                style: { fontSize: '14px', color: '#666' }
              })
            ]
          })
        }),

        // Drawer (conditionally rendered for proper animation)
        ...(this.state.isDrawerOpen ? [
          new Drawer({
            overlay: true,
            onOverlayTap: () => this.toggleDrawer(),
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            animationDuration: 300,
            children: [
              // Drawer Header
              new Container({
                height: 160,
                padding: 16,
                backgroundColor: '#2196F3',
                child: new Column({
                  mainAxisAlignment: 'end',
                  crossAxisAlignment: 'start',
                  children: [
                    new Text('Glint App', {
                      style: { 
                        color: 'white', 
                        fontSize: '24px', 
                        fontWeight: 'bold' 
                      }
                    }),
                    new Text('Navigation Drawer', {
                      style: { 
                        color: '#bbdefb', 
                        fontSize: '16px' 
                      }
                    })
                  ]
                })
              }),

              // Drawer Items
              new ListTile({
                leading: new Icon('📊', { size: 24 }),
                title: 'Dashboard',
                onTap: () => this.selectPage('Dashboard'),
                selected: this.state.selectedPage === 'Dashboard'
              }),

              new ListTile({
                leading: new Icon('👥', { size: 24 }),
                title: 'Users',
                onTap: () => this.selectPage('Users'),
                selected: this.state.selectedPage === 'Users'
              }),

              new ListTile({
                leading: new Icon('📈', { size: 24 }),
                title: 'Analytics',
                onTap: () => this.selectPage('Analytics'),
                selected: this.state.selectedPage === 'Analytics'
              }),

              new Divider(),

              new ListTile({
                leading: new Icon('⚙️', { size: 24 }),
                title: 'Settings',
                onTap: () => this.selectPage('Settings'),
                selected: this.state.selectedPage === 'Settings'
              }),

              new ListTile({
                leading: new Icon('❓', { size: 24 }),
                title: 'Help',
                onTap: () => this.selectPage('Help'),
                selected: this.state.selectedPage === 'Help'
              })
            ]
          })
        ] : [])
      ])
    });
  }
}

runApp(new DrawerExampleApp());
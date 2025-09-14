import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { ListTile } from '../glint/widgets/navigation/ListTile.js';
import { Icon } from '../glint/widgets/display/Icon.js';
import { Divider } from '../glint/widgets/display/Divider.js';

class NavigationExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { selectedIndex: -1, message: '' };
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        gap: 16,
        children: [
          new Text('Navigation Widgets Test', {
            style: { fontSize: '24px', fontWeight: 'bold' }
          }),

          new Text('ListTile Examples:', { 
            style: { fontSize: '18px', fontWeight: 'bold' } 
          }),

          // Basic ListTiles
          new ListTile({
            leading: new Icon('👤', { size: 24 }),
            title: 'Profile',
            subtitle: 'Manage your account',
            onTap: () => {
              this.setState({ 
                selectedIndex: 0,
                message: 'Profile tapped!' 
              });
            },
            selected: this.state.selectedIndex === 0
          }),

          new ListTile({
            leading: new Icon('⚙️', { size: 24 }),
            title: 'Settings',
            subtitle: 'App preferences',
            trailing: new Icon('▶️', { size: 16 }),
            onTap: () => {
              this.setState({ 
                selectedIndex: 1,
                message: 'Settings tapped!' 
              });
            },
            selected: this.state.selectedIndex === 1
          }),

          new Divider(),

          new ListTile({
            leading: new Icon('📧', { size: 24 }),
            title: 'Messages',
            subtitle: '3 unread messages',
            trailing: new Container({
              padding: 4,
              backgroundColor: '#dc3545',
              borderRadius: 12,
              child: new Text('3', { 
                style: { 
                  color: 'white', 
                  fontSize: '12px',
                  fontWeight: 'bold' 
                } 
              })
            }),
            onTap: () => {
              this.setState({ 
                selectedIndex: 2,
                message: 'Messages tapped!' 
              });
            },
            selected: this.state.selectedIndex === 2
          }),

          new ListTile({
            leading: new Icon('🔔', { size: 24 }),
            title: 'Notifications',
            enabled: false,
            subtitle: 'Currently disabled'
          }),

          new Divider(),

          // Custom styled ListTile
          new ListTile({
            leading: new Icon('🎨', { size: 24 }),
            title: 'Custom Style',
            subtitle: 'Different background color',
            contentPadding: '20px',
            style: { 
              backgroundColor: '#f0f8ff',
              borderRadius: '8px',
              border: '1px solid #007bff'
            },
            onTap: () => {
              this.setState({ 
                selectedIndex: 3,
                message: 'Custom style tapped!' 
              });
            },
            selected: this.state.selectedIndex === 3
          }),

          // Status message
          new Container({
            padding: 16,
            backgroundColor: '#e7f3ff',
            borderRadius: 8,
            child: new Text(
              this.state.message || 'Tap any list item to see interaction!',
              {
                style: { 
                  fontSize: '14px',
                  color: '#007bff',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }
              }
            )
          })
        ]
      })
    });
  }
}

runApp(new NavigationExampleApp());
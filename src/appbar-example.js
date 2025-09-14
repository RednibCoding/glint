import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { AppBar } from '../glint/widgets/navigation/AppBar.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Button } from '../glint/widgets/basic/Button.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { Icon } from '../glint/widgets/display/Icon.js';

class AppBarExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { message: 'Click on the AppBar icons!' };
  }

  build() {
    return new Column([
      new AppBar({
        title: 'Glint AppBar Demo',
        leading: new Button('☰', {
          style: { 
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            padding: '8px'
          },
          onPressed: () => {
            this.setState({ message: '🍔 Hamburger menu clicked! This would typically open a navigation drawer.' });
          }
        }),
        actions: [
          new Button('🔍', {
            style: { 
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              padding: '8px'
            },
            onPressed: () => {
              this.setState({ message: '🔍 Search clicked! This would typically open a search interface.' });
            }
          }),
          new Button('⋮', {
            style: { 
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              padding: '8px'
            },
            onPressed: () => {
              this.setState({ message: '⋮ More menu clicked! This would typically show additional options.' });
            }
          })
        ],
        backgroundColor: '#2196F3',
        elevation: 4
      }),
      new Container({
        padding: 20,
        child: new Column({
          gap: 16,
          children: [
            new Text('Interactive AppBar Examples', {
              style: { fontSize: '24px', fontWeight: 'bold' }
            }),
            new Container({
              padding: 16,
              backgroundColor: '#e7f3ff',
              borderRadius: 8,
              border: '1px solid #2196F3',
              child: new Text(this.state.message, {
                style: { 
                  fontSize: '16px',
                  color: '#2196F3',
                  fontWeight: 'bold'
                }
              })
            }),
            new Text('The AppBar above now has interactive elements:'),
            new Text('• Leading icon (☰) - Opens navigation drawer'),
            new Text('• Search icon (🔍) - Opens search interface'),
            new Text('• More menu (⋮) - Shows additional options'),
            new Container({
              padding: 16,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              child: new Column({
                gap: 8,
                children: [
                  new Text('💡 Implementation Note:', {
                    style: { fontWeight: 'bold', fontSize: '14px' }
                  }),
                  new Text('In a real app, these buttons would:', {
                    style: { fontSize: '14px' }
                  }),
                  new Text('• Open/close navigation drawers', {
                    style: { fontSize: '14px' }
                  }),
                  new Text('• Show search overlays or navigate to search pages', {
                    style: { fontSize: '14px' }
                  }),
                  new Text('• Display dropdown menus or action sheets', {
                    style: { fontSize: '14px' }
                  })
                ]
              })
            })
          ]
        })
      })
    ]);
  }
}

runApp(new AppBarExampleApp());
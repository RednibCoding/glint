import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { BottomNavigationBar } from '../glint/widgets/navigation/BottomNavigationBar.js';

class BottomNavExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { currentPage: 0 };
  }

  build() {
    const pages = [
      'Home Page Content\n\nThis is the home page with navigation at the bottom.',
      'Search Page Content\n\nSearch functionality would go here.',
      'Favorites Page Content\n\nYour favorite items would be displayed here.',
      'Profile Page Content\n\nUser profile settings and information.'
    ];

    const pageNames = ['Home', 'Search', 'Favorites', 'Profile'];

    return new Column([
      // Main content area
      new Container({
        padding: 20,
        style: { 
          flex: 1, 
          minHeight: 'calc(100vh - 80px)' // Account for bottom nav height
        },
        child: new Column({
          gap: 20,
          children: [
            new Text('BottomNavigationBar Example', {
              style: { fontSize: '24px', fontWeight: 'bold' }
            }),
            new Text(`Current Page: ${pageNames[this.state.currentPage]}`, {
              style: { fontSize: '18px', color: '#007bff' }
            }),
            new Container({
              padding: 20,
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              border: '1px solid #dee2e6',
              style: { minHeight: '200px' },
              child: new Text(pages[this.state.currentPage], {
                style: { 
                  fontSize: '16px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }
              })
            }),
            new Text('👆 Tap the bottom navigation icons to switch pages', {
              style: { 
                fontSize: '14px', 
                color: '#666',
                fontStyle: 'italic',
                textAlign: 'center'
              }
            })
          ]
        })
      }),

      // Bottom Navigation Bar
      new BottomNavigationBar({
        currentIndex: this.state.currentPage,
        onTap: (index) => {
          this.setState({ currentPage: index });
        },
        items: [
          { icon: '🏠', label: 'Home' },
          { icon: '🔍', label: 'Search' },
          { icon: '❤️', label: 'Favorites' },
          { icon: '👤', label: 'Profile' }
        ],
        backgroundColor: '#ffffff',
        selectedItemColor: '#007bff',
        unselectedItemColor: '#666666',
        elevation: 8
      })
    ]);
  }
}

runApp(new BottomNavExampleApp());
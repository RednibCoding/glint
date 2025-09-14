import { runApp } from '../glint/framework/app.js';
import { StatelessWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { Row } from '../glint/widgets/layout/Row.js';

class LayoutExampleApp extends StatelessWidget {
  constructor() {
    super();
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        gap: 20,
        children: [
          new Text('Layout Test', {
            style: { fontSize: '24px', fontWeight: 'bold' }
          }),
          
          // Column layout
          new Container({
            backgroundColor: '#f0f8ff',
            padding: 16,
            borderRadius: 8,
            child: new Column({
              gap: 8,
              children: [
                new Text('Column Layout:', { 
                  style: { fontWeight: 'bold' } 
                }),
                new Text('Item 1'),
                new Text('Item 2'),
                new Text('Item 3')
              ]
            })
          }),

          // Row layout
          new Container({
            backgroundColor: '#f0fff0',
            padding: 16,
            borderRadius: 8,
            child: new Column({
              gap: 8,
              children: [
                new Text('Row Layout:', { 
                  style: { fontWeight: 'bold' } 
                }),
                new Row({
                  gap: 12,
                  children: [
                    new Text('Item A'),
                    new Text('Item B'),
                    new Text('Item C')
                  ]
                })
              ]
            })
          }),

          // Mixed layout
          new Container({
            backgroundColor: '#fff0f0',
            padding: 16,
            borderRadius: 8,
            child: new Column({
              gap: 8,
              children: [
                new Text('Mixed Layout:', { 
                  style: { fontWeight: 'bold' } 
                }),
                new Row({
                  gap: 12,
                  children: [
                    new Container({
                      backgroundColor: '#fff',
                      padding: 8,
                      borderRadius: 4,
                      child: new Text('Box 1')
                    }),
                    new Container({
                      backgroundColor: '#fff',
                      padding: 8,
                      borderRadius: 4,
                      child: new Text('Box 2')
                    })
                  ]
                })
              ]
            })
          })
        ]
      })
    });
  }
}

runApp(new LayoutExampleApp());
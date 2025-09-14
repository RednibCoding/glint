import { runApp } from '../glint/framework/app.js';
import { StatelessWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';

class TextExampleApp extends StatelessWidget {
  constructor() {
    super();
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column([
        new Text('Hello, Glint!'),
        new Text('This is a basic text widget.', {
          style: { fontSize: '18px', color: '#007bff' }
        }),
        new Text('Different styled text', {
          style: { 
            fontSize: '14px', 
            color: '#666', 
            fontWeight: 'bold',
            fontStyle: 'italic'
          }
        })
      ])
    });
  }
}

runApp(new TextExampleApp());
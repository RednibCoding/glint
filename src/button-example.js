import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Button } from '../glint/widgets/basic/Button.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';

class ButtonExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { count: 0, message: '' };
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        gap: 16,
        children: [
          new Text('Button Test', {
            style: { fontSize: '24px', fontWeight: 'bold' }
          }),
          new Button({
            child: new Text('Click me!'),
            onPressed: () => {
              this.setState({ 
                count: this.state.count + 1,
                message: `Button clicked ${this.state.count + 1} times!`
              });
            }
          }),
          new Button({
            child: new Text('Disabled Button'),
            disabled: true
          }),
          new Button({
            child: new Text('Custom Styled'),
            style: { 
              backgroundColor: '#28a745', 
              borderRadius: '20px' 
            },
            hoverStyle: {
              backgroundColor: '#1e7e34' // Simple custom hover color
            },
            onPressed: () => {
              this.setState({ message: 'Custom button with custom hover clicked!' });
            }
          }),
          new Text(this.state.message || 'Click a button to see the result')
        ]
      })
    });
  }
}

runApp(new ButtonExampleApp());
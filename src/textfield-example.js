import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { TextField } from '../glint/widgets/input/TextField.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';

class TextFieldExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { inputValue: '' };
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        gap: 16,
        children: [
          new Text('TextField Test', {
            style: { fontSize: '24px', fontWeight: 'bold' }
          }),
          new TextField({
            placeholder: 'Enter some text...',
            onChanged: (value) => {
              this.setState({ inputValue: value });
            }
          }),
          new Text(`You typed: "${this.state.inputValue}"`)
        ]
      })
    });
  }
}

runApp(new TextFieldExampleApp());
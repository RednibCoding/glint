import { runApp } from '../glint/framework/app.js';
import { StatelessWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';

class MinimalTestApp extends StatelessWidget {
  constructor() {
    super();
  }

  build() {
    return new Text('Hello Glint - Minimal Test');
  }
}

runApp(new MinimalTestApp());
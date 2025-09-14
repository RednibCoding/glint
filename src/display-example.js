import { runApp } from '../glint/framework/app.js';
import { StatelessWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { Row } from '../glint/widgets/layout/Row.js';
import { Card } from '../glint/widgets/display/Card.js';
import { Icon } from '../glint/widgets/display/Icon.js';
import { Divider } from '../glint/widgets/display/Divider.js';
import { CircularProgressIndicator } from '../glint/widgets/display/CircularProgressIndicator.js';
import { LinearProgressIndicator } from '../glint/widgets/display/LinearProgressIndicator.js';

class DisplayExampleApp extends StatelessWidget {
  constructor() {
    super();
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        gap: 20,
        children: [
          new Text('Display Widgets Test', {
            style: { fontSize: '24px', fontWeight: 'bold' }
          }),

          // Card Examples
          new Text('Card Widget:', { style: { fontSize: '18px', fontWeight: 'bold' } }),
          new Card({
            child: new Container({
              padding: 16,
              child: new Text('Basic Card with default styling')
            })
          }),
          new Card({
            elevation: 8,
            borderRadius: 12,
            color: '#f0f8ff',
            child: new Container({
              padding: 20,
              child: new Column({
                gap: 8,
                children: [
                  new Text('Custom Card', { style: { fontWeight: 'bold' } }),
                  new Text('Higher elevation, custom color, rounded corners')
                ]
              })
            })
          }),

          new Divider(),

          // Icon Examples
          new Text('Icon Widget:', { style: { fontSize: '18px', fontWeight: 'bold' } }),
          new Row({
            gap: 16,
            children: [
              new Icon('🚀', { size: 24 }),
              new Icon('⭐', { size: 32, color: '#FFD700' }),
              new Icon('❤️', { size: 28 }),
              new Icon('🎯', { size: 30, color: '#007bff' }),
              new Icon('🔥', { size: 26 })
            ]
          }),

          new Divider({ color: '#007bff', thickness: 2 }),

          // Progress Indicators
          new Text('Progress Indicators:', { style: { fontSize: '18px', fontWeight: 'bold' } }),
          
          new Text('Circular Progress:'),
          new Row({
            gap: 20,
            children: [
              new CircularProgressIndicator({ size: 40 }),
              new CircularProgressIndicator({ 
                size: 50, 
                color: '#28a745',
                strokeWidth: 6
              }),
              new CircularProgressIndicator({ 
                size: 30, 
                color: '#dc3545',
                backgroundColor: '#f8f9fa'
              })
            ]
          }),

          new Text('Linear Progress:'),
          new LinearProgressIndicator(),
          new LinearProgressIndicator({ 
            value: 0.7, 
            color: '#007bff',
            height: 8
          }),
          new LinearProgressIndicator({ 
            value: 0.3, 
            color: '#28a745',
            backgroundColor: '#e9ecef'
          }),

          new Divider({ indent: 50, endIndent: 50 }),

          new Card({
            child: new Container({
              padding: 16,
              child: new Text('All display widgets are working! 🎉', {
                style: { 
                  textAlign: 'center',
                  fontSize: '16px',
                  color: '#28a745',
                  fontWeight: 'bold'
                }
              })
            })
          })
        ]
      })
    });
  }
}

runApp(new DisplayExampleApp());
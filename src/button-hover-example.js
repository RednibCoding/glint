import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Button } from '../glint/widgets/basic/Button.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { Row } from '../glint/widgets/layout/Row.js';

class ButtonHoverExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { message: 'Hover over the buttons to see different hover effects!' };
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        gap: 20,
        crossAxisAlignment: 'center',
        children: [
          new Text('🎨 Button Hover Styles Demo', {
            style: { 
              fontSize: '28px', 
              fontWeight: 'bold',
              marginBottom: '10px',
              color: '#333'
            }
          }),

          new Text(this.state.message, {
            style: { 
              fontSize: '16px', 
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px'
            }
          }),

          // Default hover (no hoverStyle specified)
          new Text('🔵 Default Hover (Theme Colors):', {
            style: { fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }
          }),
          
          new Row({
            mainAxisAlignment: 'center',
            gap: 15,
            children: [
              new Button({
                child: new Text('Default Blue'),
                onPressed: () => this.setState({ message: 'Default button clicked! Uses theme hover color.' })
              }),

              new Button({
                child: new Text('Custom Base'),
                style: { backgroundColor: '#4caf50' },
                onPressed: () => this.setState({ message: 'Custom styled button with default hover.' })
              })
            ]
          }),

          // Custom hover colors
          new Text('✨ Custom Hover Colors:', {
            style: { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '20px 0 10px 0' }
          }),
          
          new Row({
            mainAxisAlignment: 'center',
            gap: 15,
            children: [
              new Button({
                child: new Text('Purple → Pink'),
                style: { backgroundColor: '#9c27b0' },
                hoverStyle: { backgroundColor: '#e91e63' }, // Custom hover color
                onPressed: () => this.setState({ message: 'Purple button with custom pink hover!' })
              }),

              new Button({
                child: new Text('Dark → Light'),
                style: { backgroundColor: '#424242', color: 'white' },
                hoverStyle: { backgroundColor: '#e0e0e0', color: '#333' }, // Change both bg and text color
                onPressed: () => this.setState({ message: 'Dark button with light hover effect!' })
              })
            ]
          }),

          // Advanced hover effects
          new Text('🎯 Advanced Hover Effects:', {
            style: { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '20px 0 10px 0' }
          }),
          
          new Row({
            mainAxisAlignment: 'center',
            gap: 15,
            children: [
              new Button({
                child: new Text('Scale & Shadow'),
                style: { 
                  backgroundColor: '#673ab7',
                  borderRadius: '25px',
                  padding: '15px 30px'
                },
                hoverStyle: { 
                  backgroundColor: '#9c27b0',
                  transform: 'scale(1.05)', // Scale up on hover
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                },
                onPressed: () => this.setState({ message: 'Fancy button with transform and shadow hover!' })
              }),

              new Button({
                child: new Text('Outline → Filled'),
                style: { 
                  backgroundColor: 'transparent',
                  color: '#2196f3',
                  border: '2px solid #2196f3',
                  borderRadius: '8px'
                },
                hoverStyle: { 
                  backgroundColor: '#2196f3',
                  color: 'white'
                },
                onPressed: () => this.setState({ message: 'Outline button with fill hover effect!' })
              })
            ]
          })
        ]
      })
    });
  }
}

runApp(new ButtonHoverExampleApp());
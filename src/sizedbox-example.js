import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Button } from '../glint/widgets/basic/Button.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { Row } from '../glint/widgets/layout/Row.js';
import { SizedBox } from '../glint/widgets/layout/SizedBox.js';

class SizedBoxExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { 
      selectedExample: 'spacing',
      boxWidth: 200,
      boxHeight: 100
    };
  }

  selectExample(example) {
    this.setState({ selectedExample: example });
  }

  updateDimensions(width, height) {
    this.setState({ boxWidth: width, boxHeight: height });
  }

  renderExample() {
    switch (this.state.selectedExample) {
      case 'spacing':
        return new Column({
          crossAxisAlignment: 'center',
          children: [
            new Text('Item 1', { 
              style: { 
                backgroundColor: '#e3f2fd', 
                padding: '10px',
                border: '1px solid #2196f3'
              }
            }),
            
            new SizedBox({ height: 30 }), // Vertical spacing
            
            new Text('Item 2 (30px gap above)', { 
              style: { 
                backgroundColor: '#f3e5f5', 
                padding: '10px',
                border: '1px solid #9c27b0'
              }
            }),
            
            new SizedBox({ height: 50 }), // Larger vertical spacing
            
            new Row({
              mainAxisAlignment: 'center',
              children: [
                new Text('Left', { 
                  style: { 
                    backgroundColor: '#e8f5e8', 
                    padding: '10px',
                    border: '1px solid #4caf50'
                  }
                }),
                
                new SizedBox({ width: 40 }), // Horizontal spacing
                
                new Text('Right (40px gap)', { 
                  style: { 
                    backgroundColor: '#fff3e0', 
                    padding: '10px',
                    border: '1px solid #ff9800'
                  }
                })
              ]
            })
          ]
        });

      case 'container':
        return new Column({
          crossAxisAlignment: 'center',
          children: [
            new Text(`Fixed Size Container: ${this.state.boxWidth}x${this.state.boxHeight}`, {
              style: { marginBottom: '20px', fontWeight: 'bold' }
            }),
            
            new SizedBox({
              width: this.state.boxWidth,
              height: this.state.boxHeight,
              child: new Container({
                backgroundColor: '#2196f3',
                padding: 20,
                style: { 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                },
                child: new Text(`${this.state.boxWidth} × ${this.state.boxHeight}`)
              })
            }),
            
            new SizedBox({ height: 30 }),
            
            new Row({
              mainAxisAlignment: 'center',
              children: [
                new Button({
                  onPressed: () => this.updateDimensions(150, 75),
                  child: new Text('Small', { style: { fontSize: '14px' } }),
                  style: { margin: '0 5px' }
                }),
                new Button({
                  onPressed: () => this.updateDimensions(250, 125),
                  child: new Text('Medium', { style: { fontSize: '14px' } }),
                  style: { margin: '0 5px' }
                }),
                new Button({
                  onPressed: () => this.updateDimensions(350, 175),
                  child: new Text('Large', { style: { fontSize: '14px' } }),
                  style: { margin: '0 5px' }
                })
              ]
            })
          ]
        });

      case 'square':
        return new Column({
          crossAxisAlignment: 'center',
          children: [
            new Text('Square SizedBoxes', {
              style: { marginBottom: '20px', fontWeight: 'bold' }
            }),
            
            new Row({
              mainAxisAlignment: 'center',
              children: [
                SizedBox.square(50, {
                  child: new Container({
                    backgroundColor: '#f44336',
                    style: { 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    },
                    child: new Text('50')
                  })
                }),
                
                new SizedBox({ width: 20 }),
                
                SizedBox.square(80, {
                  child: new Container({
                    backgroundColor: '#4caf50',
                    style: { 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    },
                    child: new Text('80')
                  })
                }),
                
                new SizedBox({ width: 20 }),
                
                SizedBox.square(110, {
                  child: new Container({
                    backgroundColor: '#2196f3',
                    style: { 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    },
                    child: new Text('110')
                  })
                })
              ]
            })
          ]
        });

      case 'empty':
        return new Column({
          crossAxisAlignment: 'center',
          children: [
            new Text('Empty SizedBox for Spacing', {
              style: { marginBottom: '20px', fontWeight: 'bold' }
            }),
            
            new Container({
              backgroundColor: '#e0e0e0',
              padding: 20,
              style: { textAlign: 'center' },
              child: new Column({
                children: [
                  new Text('Above', { style: { backgroundColor: '#ffeb3b', padding: '10px' } }),
                  new SizedBox({ height: 60 }), // Empty spacer
                  new Text('Below (60px gap)', { style: { backgroundColor: '#ffeb3b', padding: '10px' } })
                ]
              })
            })
          ]
        });

      default:
        return new Text('Unknown example');
    }
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        crossAxisAlignment: 'stretch',
        children: [
          new Text('SizedBox Widget Examples', {
            style: { 
              fontSize: '32px', 
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '30px',
              color: '#1976d2'
            }
          }),

          // Navigation buttons
          new Container({
            backgroundColor: '#f5f5f5',
            padding: 15,
            borderRadius: 8,
            marginBottom: 30,
            child: new Row({
              mainAxisAlignment: 'center',
              children: [
                new Button({
                  onPressed: () => this.selectExample('spacing'),
                  child: new Text('Spacing', { style: { fontSize: '14px' } }),
                  style: { 
                    margin: '0 5px',
                    backgroundColor: this.state.selectedExample === 'spacing' ? '#2196f3' : '#e0e0e0',
                    color: this.state.selectedExample === 'spacing' ? 'white' : 'black'
                  }
                }),
                new Button({
                  onPressed: () => this.selectExample('container'),
                  child: new Text('Fixed Size', { style: { fontSize: '14px' } }),
                  style: { 
                    margin: '0 5px',
                    backgroundColor: this.state.selectedExample === 'container' ? '#2196f3' : '#e0e0e0',
                    color: this.state.selectedExample === 'container' ? 'white' : 'black'
                  }
                }),
                new Button({
                  onPressed: () => this.selectExample('square'),
                  child: new Text('Square', { style: { fontSize: '14px' } }),
                  style: { 
                    margin: '0 5px',
                    backgroundColor: this.state.selectedExample === 'square' ? '#2196f3' : '#e0e0e0',
                    color: this.state.selectedExample === 'square' ? 'white' : 'black'
                  }
                }),
                new Button({
                  onPressed: () => this.selectExample('empty'),
                  child: new Text('Empty', { style: { fontSize: '14px' } }),
                  style: { 
                    margin: '0 5px',
                    backgroundColor: this.state.selectedExample === 'empty' ? '#2196f3' : '#e0e0e0',
                    color: this.state.selectedExample === 'empty' ? 'white' : 'black'
                  }
                })
              ]
            })
          }),

          // Example content
          new Container({
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 8,
            border: '1px solid #ddd',
            minHeight: 300,
            style: { textAlign: 'center' },
            child: this.renderExample()
          }),

          // Description
          new Container({
            backgroundColor: '#f8f9fa',
            padding: 20,
            borderRadius: 8,
            marginTop: 20,
            child: new Column({
              crossAxisAlignment: 'start',
              children: [
                new Text('SizedBox Features:', {
                  style: { fontWeight: 'bold', marginBottom: '12px' }
                }),
                new Text('• Fixed width and height dimensions'),
                new Text('• Perfect for spacing between widgets'),
                new Text('• Can contain child widgets or be empty'),
                new Text('• Static methods: square(), width(), height()'),
                new Text('• Supports both pixel numbers and CSS strings')
              ]
            })
          })
        ]
      })
    });
  }
}

runApp(new SizedBoxExampleApp());
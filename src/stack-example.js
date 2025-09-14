import { runApp } from '../glint/framework/app.js';
import { StatefulWidget } from '../glint/framework/widget.js';
import { Text } from '../glint/widgets/basic/Text.js';
import { Button } from '../glint/widgets/basic/Button.js';
import { Container } from '../glint/widgets/basic/Container.js';
import { Column } from '../glint/widgets/layout/Column.js';
import { Row } from '../glint/widgets/layout/Row.js';
import { Stack, Positioned } from '../glint/widgets/layout/Stack.js';
import { Center } from '../glint/widgets/layout/Center.js';

class StackExampleApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { 
      selectedExample: 'basic',
      showOverlay: false,
      cardPosition: { top: 50, left: 50 }
    };
  }

  selectExample(example) {
    this.setState({ selectedExample: example });
  }

  toggleOverlay() {
    this.setState({ showOverlay: !this.state.showOverlay });
  }

  moveCard() {
    this.setState({ 
      cardPosition: { 
        top: Math.random() * 200 + 50,
        left: Math.random() * 300 + 50
      }
    });
  }

  renderExample() {
    switch (this.state.selectedExample) {
      case 'basic':
        return new Stack({
          style: { 
            width: '300px', 
            height: '200px', 
            border: '2px dashed #ccc',
            margin: '20px auto'
          },
          children: [
            // Base layer
            new Container({
              style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              child: new Text('Base Layer', {
                style: { fontSize: '24px', color: '#1976d2' }
              })
            }),

            // Positioned elements
            new Positioned({
              top: 10,
              left: 10,
              child: new Container({
                style: {
                  backgroundColor: '#fff3e0',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #ff9800'
                },
                child: new Text('Top Left', { style: { color: '#f57c00' } })
              })
            }),

            new Positioned({
              top: 10,
              right: 10,
              child: new Container({
                style: {
                  backgroundColor: '#f3e5f5',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #9c27b0'
                },
                child: new Text('Top Right', { style: { color: '#7b1fa2' } })
              })
            }),

            new Positioned({
              bottom: 10,
              left: 10,
              child: new Container({
                style: {
                  backgroundColor: '#e8f5e8',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #4caf50'
                },
                child: new Text('Bottom Left', { style: { color: '#2e7d32' } })
              })
            }),

            new Positioned({
              bottom: 10,
              right: 10,
              child: new Container({
                style: {
                  backgroundColor: '#ffebee',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #f44336'
                },
                child: new Text('Bottom Right', { style: { color: '#c62828' } })
              })
            })
          ]
        });

      case 'overlay':
        return new Stack({
          style: { 
            width: '400px', 
            height: '300px', 
            border: '2px solid #333',
            margin: '20px auto'
          },
          children: [
            // Main content
            new Container({
              style: {
                width: '100%',
                height: '100%',
                backgroundColor: '#f5f5f5',
                padding: '20px'
              },
              child: new Column({
                gap: 15,
                children: [
                  new Text('Main Content', {
                    style: { fontSize: '24px', fontWeight: 'bold' }
                  }),
                  new Text('This is the main content area. Click the button below to show an overlay.'),
                  new Button({
                    child: new Text(this.state.showOverlay ? 'Hide Overlay' : 'Show Overlay'),
                    onPressed: () => this.toggleOverlay(),
                    style: { backgroundColor: '#2196f3', alignSelf: 'flex-start' }
                  })
                ]
              })
            }),

            // Overlay (conditionally shown)
            ...(this.state.showOverlay ? [
              new Positioned({
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                child: new Container({
                  style: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  child: new Container({
                    style: {
                      backgroundColor: 'white',
                      padding: '30px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                      textAlign: 'center'
                    },
                    child: new Column({
                      gap: 15,
                      children: [
                        new Text('🎉 Overlay Modal', {
                          style: { fontSize: '20px', fontWeight: 'bold' }
                        }),
                        new Text('This overlay covers the entire stack!'),
                        new Button({
                          child: new Text('Close'),
                          onPressed: () => this.toggleOverlay(),
                          style: { backgroundColor: '#f44336' }
                        })
                      ]
                    })
                  })
                })
              })
            ] : [])
          ]
        });

      case 'animated':
        return new Stack({
          style: { 
            width: '400px', 
            height: '250px', 
            border: '2px solid #673ab7',
            margin: '20px auto'
          },
          children: [
            // Background
            new Container({
              style: {
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              child: new Text('✨ Animated Stack', {
                style: { fontSize: '24px', color: 'white', fontWeight: 'bold' }
              })
            }),

            // Moving card
            new Positioned({
              top: this.state.cardPosition.top,
              left: this.state.cardPosition.left,
              child: new Container({
                style: {
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                },
                child: new Text('🎯 Click Move!', {
                  style: { fontWeight: 'bold', color: '#673ab7' }
                })
              })
            }),

            // Control button
            new Positioned({
              bottom: 20,
              right: 20,
              child: new Button({
                child: new Text('Move Card'),
                onPressed: () => this.moveCard(),
                style: { 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#673ab7',
                  fontWeight: 'bold'
                }
              })
            })
          ]
        });

      case 'alignment':
        return new Stack({
          alignment: 'center',
          style: { 
            width: '350px', 
            height: '200px', 
            border: '2px solid #4caf50',
            margin: '20px auto'
          },
          children: [
            new Container({
              style: {
                width: '80%',
                height: '60%',
                backgroundColor: '#c8e6c9',
                borderRadius: '15px'
              }
            }),
            new Container({
              style: {
                width: '60%',
                height: '40%',
                backgroundColor: '#4caf50',
                borderRadius: '10px'
              }
            }),
            new Text('Centered Stack', {
              style: { 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: '18px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }
            })
          ]
        });

      default:
        return new Text('Select an example');
    }
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        gap: 20,
        children: [
          new Text('📚 Stack Widget Examples', {
            style: { 
              fontSize: '28px', 
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#333'
            }
          }),

          new Text('Stack allows you to overlay widgets on top of each other, similar to absolute positioning.', {
            style: { 
              fontSize: '16px', 
              color: '#666',
              textAlign: 'center',
              marginBottom: '10px'
            }
          }),

          // Example selector
          new Row({
            mainAxisAlignment: 'center',
            gap: 10,
            children: [
              new Button({
                child: new Text('Basic'),
                style: { 
                  backgroundColor: this.state.selectedExample === 'basic' ? '#2196f3' : '#e0e0e0',
                  color: this.state.selectedExample === 'basic' ? 'white' : '#333'
                },
                onPressed: () => this.selectExample('basic')
              }),
              new Button({
                child: new Text('Overlay'),
                style: { 
                  backgroundColor: this.state.selectedExample === 'overlay' ? '#2196f3' : '#e0e0e0',
                  color: this.state.selectedExample === 'overlay' ? 'white' : '#333'
                },
                onPressed: () => this.selectExample('overlay')
              }),
              new Button({
                child: new Text('Animated'),
                style: { 
                  backgroundColor: this.state.selectedExample === 'animated' ? '#2196f3' : '#e0e0e0',
                  color: this.state.selectedExample === 'animated' ? 'white' : '#333'
                },
                onPressed: () => this.selectExample('animated')
              }),
              new Button({
                child: new Text('Alignment'),
                style: { 
                  backgroundColor: this.state.selectedExample === 'alignment' ? '#2196f3' : '#e0e0e0',
                  color: this.state.selectedExample === 'alignment' ? 'white' : '#333'
                },
                onPressed: () => this.selectExample('alignment')
              })
            ]
          }),

          // Current example
          this.renderExample(),

          // Code example
          new Container({
            style: {
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            },
            child: new Column({
              gap: 10,
              crossAxisAlignment: 'flex-start',
              children: [
                new Text('💻 Usage Example:', {
                  style: { fontWeight: 'bold', color: '#333' }
                }),
                new Text(`new Stack({
  children: [
    new Container({ /* base layer */ }),
    new Positioned({
      top: 10,
      left: 10,
      child: new Container({
        child: new Text('Positioned')
      })
    })
  ]
})`, {
                  style: { 
                    fontFamily: 'monospace', 
                    fontSize: '14px',
                    color: '#666',
                    whiteSpace: 'pre-wrap'
                  }
                })
              ]
            })
          })
        ]
      })
    });
  }
}

runApp(new StackExampleApp());
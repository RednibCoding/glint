import { 
  StatefulWidget, 
  runApp, 
  Column, 
  Row,
  Text, 
  Button, 
  Container,
  Center 
} from '../glint/glint.js';

// Counter App - similar to Flutter's default counter example
class CounterApp extends StatefulWidget {
  constructor() {
    super();
    this.state = { 
      count: 0,
      message: 'Welcome to Glint!',
      debugLog: 'Ready...'
    };
  }

  increment() {
    console.log('increment() called! Current state:', this.state);
    this.setState({ 
      count: this.state.count + 1,
      debugLog: `increment() called at ${new Date().toLocaleTimeString()}`
    });
  }

  decrement() {
    console.log('decrement() called! Current state:', this.state);
    this.setState({ 
      count: this.state.count - 1,
      debugLog: `decrement() called at ${new Date().toLocaleTimeString()}`
    });
  }

  reset() {
    console.log('reset() called! Current state:', this.state);
    this.setState({ 
      count: 0,
      message: 'Counter reset!' 
    });
  }

  build() {
    return new Container({
      padding: 20,
      child: new Column({
        mainAxisAlignment: 'center',
        crossAxisAlignment: 'center',
        gap: 20,
        style: { height: '100vh' },
        children: [
          new Text('🚀 Glint Counter Demo', {
            style: {
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px'
            }
          }),
          
          new Text(this.state.message, {
            style: {
              fontSize: '18px',
              color: '#666',
              marginBottom: '10px'
            }
          }),

          new Text(`Debug: ${this.state.debugLog}`, {
            style: {
              fontSize: '14px',
              color: 'red',
              marginBottom: '20px',
              fontFamily: 'monospace'
            }
          }),

          new Container({
            padding: 30,
            backgroundColor: '#f8f9fa',
            borderRadius: 15,
            border: '1px solid #dee2e6',
            child: new Center({
              child: new Text(`Count: ${this.state.count}`, {
                style: {
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: this.state.count === 0 ? '#6c757d' : 
                        this.state.count > 0 ? '#28a745' : '#dc3545'
                }
              })
            })
          }),

          new Row({
            mainAxisAlignment: 'center',
            gap: 15,
            children: [
              new Button('- Decrement', {
                onPressed: () => {
                  console.log('Decrement button onPressed called, this:', this);
                  this.setState({ debugLog: 'Decrement button clicked!' });
                  setTimeout(() => this.decrement(), 100); // Delay to see the debug message
                },
                style: {
                  backgroundColor: '#dc3545',
                  padding: '15px 25px',
                  fontSize: '16px',
                  borderRadius: '8px'
                }
              }),

              new Button('Reset', {
                onPressed: () => this.reset(),
                style: {
                  backgroundColor: '#6c757d',
                  padding: '15px 25px',
                  fontSize: '16px',
                  borderRadius: '8px'
                }
              }),

              new Button('+ Increment', {
                onPressed: () => this.increment(),
                style: {
                  backgroundColor: '#28a745',
                  padding: '15px 25px',
                  fontSize: '16px',
                  borderRadius: '8px'
                }
              })
            ]
          }),

          // Fun fact display
          new Container({
            padding: 15,
            backgroundColor: this.state.count % 2 === 0 ? '#e7f3ff' : '#fff3e0',
            borderRadius: 8,
            border: `2px solid ${this.state.count % 2 === 0 ? '#007bff' : '#ff9800'}`,
            child: new Text(
              this.state.count === 0 ? 'Start counting!' :
              this.state.count % 2 === 0 ? `${this.state.count} is even! 🎯` :
              `${this.state.count} is odd! ⚡`,
              {
                style: {
                  fontSize: '16px',
                  color: this.state.count % 2 === 0 ? '#007bff' : '#ff9800',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }
              }
            )
          })
        ]
      })
    });
  }
}

// Start the app
runApp(new CounterApp());
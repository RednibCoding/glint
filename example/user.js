// Create reactive global state
const userState = createState('user', {
  name: 'Anonymous',
  isLoggedIn: false
});

// Create global actions
const userActions = createActions('user', {
  login(name) {
    userState.name = name;
    userState.isLoggedIn = true;
  },
  logout() {
    userState.name = 'Anonymous';
    userState.isLoggedIn = false;
  }
});
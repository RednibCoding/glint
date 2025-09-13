// User Store - manages user authentication and profile
const userStore = createStore('user',
    {
        currentUser: null,
        isLoggedIn: false,
        preferences: {}
    },
    {
        login: (get, set, username) => {
            set({ 
                currentUser: { name: username, loginTime: new Date() },
                isLoggedIn: true 
            });
        },
        logout: (get, set) => {
            set({ 
                currentUser: null,
                isLoggedIn: false,
                preferences: {}
            });
        },
        updatePreferences: (get, set, newPrefs) => {
            set({ 
                preferences: { ...get().preferences, ...newPrefs }
            });
        }
    }
);
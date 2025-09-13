// Theme Store - manages application theme and UI preferences
const themeStore = createStore('theme',
    {
        theme: 'light',
        primaryColor: '#007acc',
        fontSize: 'medium'
    },
    {
        toggleTheme: (get, set) => {
            set({ theme: get().theme === 'light' ? 'dark' : 'light' });
        },
        setPrimaryColor: (get, set, color) => {
            set({ primaryColor: color });
        },
        setFontSize: (get, set, size) => {
            set({ fontSize: size });
        },
        applyPreset: (get, set, preset) => {
            const presets = {
                default: { theme: 'light', primaryColor: '#007acc', fontSize: 'medium' },
                dark: { theme: 'dark', primaryColor: '#ffa500', fontSize: 'medium' },
                accessible: { theme: 'light', primaryColor: '#2b5797', fontSize: 'large' }
            };
            if (presets[preset]) {
                set(presets[preset]);
            }
        }
    }
);
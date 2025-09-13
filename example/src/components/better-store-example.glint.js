// Better approach: Named stores/slices
function BetterGlobalExample() {
    // You could have multiple named stores like this:
    
    // Counter store
    const [counterState, counterActions] = useStore('counter',
        { count: 0 },
        {
            increment: () => updateStore('counter', state => ({ 
                count: state.count + 1 
            })),
            decrement: () => updateStore('counter', state => ({ 
                count: state.count - 1 
            }))
        }
    );
    
    // Theme store  
    const [themeState, themeActions] = useStore('theme',
        { theme: 'light', primaryColor: '#007acc' },
        {
            toggleTheme: () => updateStore('theme', state => ({ 
                theme: state.theme === 'light' ? 'dark' : 'light' 
            })),
            setPrimaryColor: (color) => updateStore('theme', { primaryColor: color })
        }
    );
    
    useHandlers({
        increment: counterActions.increment,
        decrement: counterActions.decrement,
        toggleTheme: themeActions.toggleTheme
    });
    
    return html`
        <div>
            <h3>Named Stores Example</h3>
            <p>Counter: ${counterState.count}</p>
            <p>Theme: ${themeState.theme}</p>
            <button onclick="increment">+</button>
            <button onclick="decrement">-</button>
            <button onclick="toggleTheme">Toggle Theme</button>
        </div>
    `;
}
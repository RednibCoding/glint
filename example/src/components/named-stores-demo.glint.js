function NamedStoresDemo() {
    // Use multiple named stores
    const [counterState, counterActions] = useStore('counter');
    const [themeState, themeActions] = useStore('theme');  
    const [userState, userActions] = useStore('user');
    
    // Local state for demo
    const [localMessage, setLocalMessage] = useState('Hello from local state!');
    
    useHandlers({
        // Counter actions
        increment: counterActions.increment,
        decrement: counterActions.decrement,
        reset: counterActions.reset,
        
        // Theme actions  
        toggleTheme: themeActions.toggleTheme,
        setBlueTheme: () => themeActions.setPrimaryColor('#007acc'),
        setGreenTheme: () => themeActions.setPrimaryColor('#28a745'),
        applyDarkPreset: () => themeActions.applyPreset('dark'),
        applyAccessiblePreset: () => themeActions.applyPreset('accessible'),
        
        // User actions
        loginAlice: () => userActions.login('Alice'),
        loginBob: () => userActions.login('Bob'), 
        logout: userActions.logout,
        
        // Local action
        updateMessage: () => setLocalMessage('Updated at ' + new Date().toLocaleTimeString())
    });

    return html`
        <style>
            .named-stores-demo {
                padding: 20px;
                border-radius: 8px;
                margin: 10px 0;
                transition: all 0.3s ease;
                background: ${themeState.theme === 'dark' ? '#2d2d2d' : '#f8f9fa'};
                color: ${themeState.theme === 'dark' ? 'white' : '#333'};
                border: 2px solid ${themeState.primaryColor};
                font-size: ${themeState.fontSize === 'large' ? '1.1em' : '1em'};
            }
            
            .store-section {
                margin: 15px 0;
                padding: 15px;
                border-left: 4px solid ${themeState.primaryColor};
                background: ${themeState.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
                border-radius: 4px;
            }
            
            .state-display {
                font-family: monospace;
                background: ${themeState.theme === 'dark' ? '#1a1a1a' : '#fff'};
                padding: 10px;
                border-radius: 4px;
                margin: 10px 0;
                border: 1px solid ${themeState.primaryColor}30;
            }
            
            button {
                margin: 4px;
                padding: 8px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                background: ${themeState.primaryColor};
                color: white;
                transition: opacity 0.2s;
            }
            
            button:hover {
                opacity: 0.8;
            }
            
            .secondary-btn {
                background: #6c757d;
            }
            
            .success-btn {
                background: #28a745;
            }
            
            .danger-btn {
                background: #dc3545;
            }
        </style>
        
        <div class="named-stores-demo">
            <h3>🏪 Named Stores Demo</h3>
            <p><em>Each store is independent and can be used by multiple components</em></p>
            
            <div class="store-section">
                <h4>📊 Counter Store</h4>
                <div class="state-display">
                    Count: ${counterState.count} | Step: ${counterState.step}
                </div>
                <button onclick="increment">+${counterState.step}</button>
                <button onclick="decrement">-${counterState.step}</button>
                <button class="secondary-btn" onclick="reset">Reset</button>
            </div>
            
            <div class="store-section">
                <h4>🎨 Theme Store</h4>
                <div class="state-display">
                    Theme: ${themeState.theme} | Color: ${themeState.primaryColor} | Font: ${themeState.fontSize}
                </div>
                <button onclick="toggleTheme">Toggle Theme</button>
                <button onclick="setBlueTheme" style="background: #007acc;">Blue</button>
                <button onclick="setGreenTheme" style="background: #28a745;">Green</button>
                <button class="secondary-btn" onclick="applyDarkPreset">Dark Preset</button>
                <button class="secondary-btn" onclick="applyAccessiblePreset">Accessible</button>
            </div>
            
            <div class="store-section">
                <h4>👤 User Store</h4>
                <div class="state-display">
                    ${userState.isLoggedIn ? html`
                        User: ${userState.currentUser.name}<br>
                        Logged in: ${new Date(userState.currentUser.loginTime).toLocaleTimeString()}
                    ` : 'Not logged in'}
                </div>
                ${!userState.isLoggedIn ? html`
                    <button class="success-btn" onclick="loginAlice">Login as Alice</button>
                    <button class="success-btn" onclick="loginBob">Login as Bob</button>
                ` : html`
                    <span>Welcome, ${userState.currentUser.name}!</span>
                    <button class="danger-btn" onclick="logout">Logout</button>
                `}
            </div>
            
            <div class="store-section">
                <h4>🏠 Local State</h4>
                <div class="state-display">
                    Message: "${localMessage}"
                </div>
                <button class="secondary-btn" onclick="updateMessage">Update Local Message</button>
            </div>
            
            <div class="store-section">
                <h4>💡 Benefits</h4>
                <ul>
                    <li><strong>Separation of concerns:</strong> Each store handles one domain</li>
                    <li><strong>Reusable:</strong> Multiple components can use the same stores</li>
                    <li><strong>Automatic cleanup:</strong> Subscriptions cleaned up on unmount</li>
                    <li><strong>Type safety:</strong> Clear action signatures with get/set helpers</li>
                    <li><strong>File organization:</strong> Stores in separate .store.js files</li>
                </ul>
            </div>
        </div>
    `;
}
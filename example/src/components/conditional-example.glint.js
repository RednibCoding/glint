function ConditionalExample(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('guest');
    const [items, setItems] = useState(['Apple', 'Banana', 'Orange']);

    const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
    const changeRole = () => setUserRole(userRole === 'admin' ? 'user' : 'admin');

    useHandlers({ toggleLogin, changeRole });

    const jsx = html`
        <style>
            .container { padding: 20px; border: 1px solid #ccc; margin: 10px 0; }
            .admin { background: #ffe6e6; }
            .user { background: #e6f3ff; }
            .guest { background: #f0f0f0; }
            button { margin: 5px; padding: 8px 12px; }
            .item { padding: 5px; margin: 2px 0; background: #f9f9f9; }
        </style>
        
        <div class="container ${userRole}">
            <h3>Conditional Rendering Examples</h3>
            
            <!-- Simple if/else with ternary operator -->
            <div>
                <h4>Login Status:</h4>
                ${isLoggedIn ? html`
                    <p>✅ Welcome back!</p>
                    <button onclick="toggleLogin">Logout</button>
                ` : html`
                    <p>❌ Please log in</p>
                    <button onclick="toggleLogin">Login</button>
                `}
            </div>

            <!-- Conditional content with && operator -->
            <div>
                <h4>Admin Panel:</h4>
                ${isLoggedIn && userRole === 'admin' ? html`
                    <div style="background: #ffebe6; padding: 10px;">
                        <p>🔧 Admin controls available</p>
                        <button onclick="changeRole">Switch to User</button>
                    </div>
                ` : ''}
                
                ${isLoggedIn && userRole === 'user' ? html`
                    <div style="background: #e6f7ff; padding: 10px;">
                        <p>👤 User dashboard</p>
                        <button onclick="changeRole">Request Admin</button>
                    </div>
                ` : ''}
            </div>

            <!-- Multiple conditions -->
            <div>
                <h4>Status Message:</h4>
                <p>
                    ${!isLoggedIn ? 'Please log in to continue' : 
                      userRole === 'admin' ? '🔧 Administrator privileges' :
                      userRole === 'user' ? '👤 Standard user access' :
                      '👻 Unknown role'}
                </p>
            </div>

            <!-- Loop rendering -->
            <div>
                <h4>Items List:</h4>
                ${items.length > 0 ? html`
                    <div>
                        ${items.map(item => html`
                            <div class="item">📦 ${item}</div>
                        `).join('')}
                    </div>
                ` : html`
                    <p>No items available</p>
                `}
            </div>

            <!-- Loop with index -->
            <div>
                <h4>Numbered List:</h4>
                ${items.map((item, index) => html`
                    <div class="item">
                        ${index + 1}. ${item} ${index === 0 ? '(first!)' : ''}
                    </div>
                `).join('')}
            </div>

            <!-- Complex conditional with loops -->
            ${isLoggedIn ? html`
                <div>
                    <h4>Your Privileges:</h4>
                    ${['read', 'write', userRole === 'admin' ? 'delete' : null, userRole === 'admin' ? 'manage users' : null]
                        .filter(permission => permission !== null)
                        .map(permission => `
                            <div class="item">✓ ${permission}</div>
                        `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    return jsx;
}
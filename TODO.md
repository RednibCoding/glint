# Glint Framework - Future Features TODO

## 🎯 Current Status
Glint v2.0 is feature-complete for basic to medium complexity web applications with:
- ✅ JSX-like function components
- ✅ State management (local + global named stores) 
- ✅ 32+ event types supported
- ✅ Props system with automatic binding
- ✅ Utility imports (.js files)
- ✅ Shadow DOM style encapsulation
- ✅ Hot reload development server
- ✅ HTML tagged templates for syntax highlighting

---

## 🔥 High Priority Features

### 1. Component Lifecycle Hooks
**Status:** Missing  
**Impact:** High - Essential for setup/cleanup

```javascript
function MyComponent() {
    onMount(() => {
        console.log('Component mounted');
        // Initialize third-party libraries
        // Set up subscriptions
        // Focus elements
    });
    
    onDestroy(() => {
        console.log('Component destroyed');
        // Cleanup subscriptions
        // Clear timers
        // Remove event listeners
    });
    
    return html`<div>Component content</div>`;
}
```

### 2. Effect System (useEffect)
**Status:** Missing  
**Impact:** High - Side effects management

```javascript
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Run effect when userId changes
    useEffect(() => {
        fetchUser(userId).then(userData => {
            setUser(userData);
            setLoading(false);
        });
        
        // Cleanup function
        return () => {
            // Cancel pending requests
            abortController.abort();
        };
    }, [userId]); // Dependencies array
    
    return html`
        <div>
            ${loading ? 'Loading...' : user.name}
        </div>
    `;
}
```

### 3. HTTP/API Utilities
**Status:** Missing  
**Impact:** High - Most apps need API calls

```javascript
// Basic fetch hook
function UserList() {
    const { data: users, loading, error } = useFetch('/api/users');
    
    if (loading) return html`<div>Loading users...</div>`;
    if (error) return html`<div>Error: ${error.message}</div>`;
    
    return html`
        <ul>
            ${users.map(user => `<li>${user.name}</li>`).join('')}
        </ul>
    `;
}

// Advanced fetch with options
function CreateUser() {
    const { post, loading } = useApi();
    
    const handleSubmit = async (userData) => {
        try {
            await post('/api/users', userData);
            alert('User created!');
        } catch (error) {
            alert('Failed to create user');
        }
    };
    
    return html`
        <form onsubmit="handleSubmit">
            <!-- form fields -->
            <button type="submit" ${loading ? 'disabled' : ''}>
                ${loading ? 'Creating...' : 'Create User'}
            </button>
        </form>
    `;
}
```

### 4. Local Storage Hooks
**Status:** Missing  
**Impact:** High - Data persistence

```javascript
function Settings() {
    // Automatically syncs with localStorage
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const [language, setLanguage] = useSessionStorage('language', 'en');
    const [preferences, setPreferences] = useLocalStorage('preferences', {
        notifications: true,
        autoSave: false
    });
    
    return html`
        <div>
            <select onchange="updateTheme" value="${theme}">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
            
            <label>
                <input type="checkbox" 
                       ${preferences.notifications ? 'checked' : ''}
                       onchange="toggleNotifications" />
                Enable Notifications
            </label>
        </div>
    `;
}
```

---

## 🟡 Medium Priority Features

### 5. Form Handling & Validation
**Status:** Missing  
**Impact:** Medium - Common need

```javascript
function ContactForm() {
    const { register, handleSubmit, errors, isValid } = useForm({
        email: { required: true, pattern: /\S+@\S+\.\S+/ },
        message: { required: true, minLength: 10 },
        age: { required: true, min: 18, max: 100 }
    });
    
    const onSubmit = (data) => {
        console.log('Form data:', data);
        // Submit to API
    };
    
    return html`
        <form onsubmit="handleSubmit">
            <input name="email" placeholder="Email" ${register('email')} />
            ${errors.email ? `<span class="error">${errors.email}</span>` : ''}
            
            <textarea name="message" placeholder="Message" ${register('message')}></textarea>
            ${errors.message ? `<span class="error">${errors.message}</span>` : ''}
            
            <input type="number" name="age" placeholder="Age" ${register('age')} />
            ${errors.age ? `<span class="error">${errors.age}</span>` : ''}
            
            <button type="submit" ${!isValid ? 'disabled' : ''}>Submit</button>
        </form>
    `;
}
```

### 6. Client-Side Routing
**Status:** Missing  
**Impact:** Medium - SPA navigation

```javascript
// Route configuration
const routes = [
    { path: '/', component: HomePage },
    { path: '/users', component: UserList },
    { path: '/users/:id', component: UserDetail },
    { path: '/about', component: AboutPage }
];

// Router component
function App() {
    const router = useRouter(routes);
    
    return html`
        <nav>
            <a href="/" onclick="navigate">Home</a>
            <a href="/users" onclick="navigate">Users</a>
            <a href="/about" onclick="navigate">About</a>
        </nav>
        
        <main>
            ${router.currentComponent}
        </main>
    `;
}

// In components
function UserDetail() {
    const { params } = useRouter();
    const userId = params.id;
    
    return html`<div>User ID: ${userId}</div>`;
}
```

### 7. CSS-in-JS / Dynamic Styling
**Status:** Missing  
**Impact:** Medium - Dynamic theming

```javascript
function ThemedButton({ variant = 'primary', size = 'medium' }) {
    const [isHovered, setIsHovered] = useState(false);
    
    const buttonStyles = css`
        background: ${variant === 'primary' ? '#007acc' : '#6c757d'};
        padding: ${size === 'large' ? '12px 24px' : '8px 16px'};
        transform: ${isHovered ? 'scale(1.05)' : 'scale(1)'};
        transition: all 0.3s ease;
        border-radius: 4px;
        border: none;
        color: white;
        cursor: pointer;
    `;
    
    useHandlers({
        handleMouseEnter: () => setIsHovered(true),
        handleMouseLeave: () => setIsHovered(false)
    });
    
    return html`
        <button class="${buttonStyles}" 
                onmouseenter="handleMouseEnter" 
                onmouseleave="handleMouseLeave">
            Click me
        </button>
    `;
}
```

---

## 🟢 Nice-to-Have Features

### 8. Animation & Transitions
**Status:** Missing  
**Impact:** Low - Polish/UX enhancement

```javascript
function AnimatedList({ items }) {
    const slideIn = useTransition({
        from: { opacity: 0, transform: 'translateX(-100px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
        duration: 300
    });
    
    const fadeOut = useTransition({
        from: { opacity: 1 },
        to: { opacity: 0 },
        duration: 200
    });
    
    return html`
        <ul>
            ${items.map((item, index) => `
                <li class="${slideIn}" style="animation-delay: ${index * 100}ms">
                    ${item.name}
                    <button onclick="removeItem" class="${fadeOut}">Remove</button>
                </li>
            `).join('')}
        </ul>
    `;
}
```

### 9. Media Queries & Responsive Hooks
**Status:** Missing  
**Impact:** Low - Responsive design helper

```javascript
function ResponsiveLayout() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
    const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    
    return html`
        <div class="layout ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}">
            <header>
                ${isMobile ? 'Mobile Menu' : 'Desktop Navigation'}
            </header>
            
            <main>
                <div class="grid ${isMobile ? 'single-column' : 'multi-column'}">
                    <!-- Content adapts to screen size -->
                </div>
            </main>
            
            <aside class="${isMobile ? 'hidden' : 'visible'}">
                Sidebar content
            </aside>
        </div>
    `;
}
```

### 10. Testing Utilities
**Status:** Missing  
**Impact:** Low - Development quality

```javascript
// Test file: my-component.test.js
import { render, fireEvent, waitFor } from '@glint/testing';
import MyComponent from './my-component.glint.js';

test('component renders correctly', () => {
    const { getByText, getByRole } = render(MyComponent, { 
        props: { name: 'John' } 
    });
    
    expect(getByText('Hello, John!')).toBeInTheDocument();
});

test('handles user interactions', async () => {
    const { getByRole } = render(MyComponent);
    const button = getByRole('button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
        expect(getByText('Clicked!')).toBeInTheDocument();
    });
});

test('manages state correctly', () => {
    const { getByRole, rerender } = render(CounterComponent);
    const counter = getByRole('counter');
    const button = getByRole('button', { name: 'Increment' });
    
    expect(counter).toHaveTextContent('0');
    
    fireEvent.click(button);
    expect(counter).toHaveTextContent('1');
});
```

---

## 🚀 Implementation Priority

### Phase 1: Core Lifecycle
1. **onMount/onDestroy hooks** - Essential for proper component lifecycle
2. **useEffect hook** - Side effects and dependency management

### Phase 2: Data & APIs  
3. **useFetch/useApi hooks** - HTTP utilities for common API patterns
4. **useLocalStorage/useSessionStorage** - Client-side persistence

### Phase 3: Enhanced UX
5. **useForm hook** - Form handling and validation
6. **useRouter hook** - Client-side routing for SPAs

### Phase 4: Polish
7. **CSS-in-JS system** - Dynamic styling capabilities
8. **Animation hooks** - Smooth transitions and animations
9. **Media query hooks** - Responsive design helpers
10. **Testing framework** - Component testing utilities

---

## 💡 Notes

- **Current Glint** is already excellent for static sites, demos, dashboards, and medium-complexity interactive apps
- **Phase 1 features** would make it suitable for most modern web applications  
- **All phases** would put it on par with React/Vue in terms of developer experience
- Each feature should maintain Glint's **simplicity and small footprint** philosophy
- Consider **tree-shaking** and **optional imports** to keep bundle sizes small

---

**Last Updated:** September 14, 2025  
**Glint Version:** 2.0  
**Status:** Production Ready (with noted limitations)
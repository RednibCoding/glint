#!/usr/bin/env node

/**
 * Glint Framework
 * Clean, simple, React-inspired architecture
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const http = require('http');
const WebSocket = require('ws');

class GlintCompiler {
    constructor() {
        this.components = new Map();
        this.stores = new Map();
        this.utilities = new Map(); // Add utilities support
        this.outputDir = 'build';
        this.componentFiles = [];
        this.storeFiles = [];
        this.utilityFiles = []; // Add utility files
    }

    async build(watchMode = false) {
        this.watchMode = watchMode; // Store for use in other methods
        
        console.log('🚀 Glint v2.0 - Building JSX Components...');
        
        // Ensure build directory exists
        fs.mkdirSync(this.outputDir, { recursive: true });
        
        // Find all component and store files
        this.componentFiles = this.findComponentFiles('src');
        this.storeFiles = this.findStoreFiles('src');
        this.utilityFiles = this.findUtilityFiles('src');
        
        if (this.componentFiles.length === 0 && this.storeFiles.length === 0 && this.utilityFiles.length === 0) {
            console.log('No .glint.js, .store.js, or .js files found in src/ directory');
            return;
        }

        // Process utilities first, then stores, then components
        this.utilityFiles.forEach(file => this.processUtility(file));
        this.storeFiles.forEach(file => this.processStore(file));
        this.componentFiles.forEach(file => this.processComponent(file));
        
        // Generate the bundle
        this.generateBundle();
        
        const totalFiles = this.componentFiles.length + this.storeFiles.length + this.utilityFiles.length;
        console.log(`✅ Built ${this.componentFiles.length} components + ${this.storeFiles.length} stores + ${this.utilityFiles.length} utilities (${totalFiles} files) successfully!`);

        if (watchMode) {
            this.startWatcher();
            this.startDevServer();
        }
    }

    findComponentFiles(dir) {
        if (!fs.existsSync(dir)) return [];
        
        return fs.readdirSync(dir, { withFileTypes: true })
            .flatMap(entry => {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    return this.findComponentFiles(fullPath);
                } else if (entry.name.endsWith('.glint.js')) {
                    return [fullPath];
                }
                return [];
            });
    }

    findStoreFiles(dir) {
        if (!fs.existsSync(dir)) return [];
        
        return fs.readdirSync(dir, { withFileTypes: true })
            .flatMap(entry => {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    return this.findStoreFiles(fullPath);
                } else if (entry.name.endsWith('.store.js')) {
                    return [fullPath];
                }
                return [];
            });
    }

    findUtilityFiles(dir) {
        if (!fs.existsSync(dir)) return [];
        
        return fs.readdirSync(dir, { withFileTypes: true })
            .flatMap(entry => {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    return this.findUtilityFiles(fullPath);
                } else if (entry.name.endsWith('.js') && 
                          !entry.name.endsWith('.glint.js') && 
                          !entry.name.endsWith('.store.js')) {
                    return [fullPath];
                }
                return [];
            });
    }

    processStore(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const storeName = this.getStoreName(filePath);
        
        this.stores.set(storeName, { content, filePath });
    }

    processUtility(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const utilityName = this.getUtilityName(filePath);
        
        this.utilities.set(utilityName, { content, filePath });
    }

    getStoreName(filePath) {
        const filename = path.basename(filePath, '.store.js');
        return filename.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('') + 'Store';
    }

    getUtilityName(filePath) {
        const filename = path.basename(filePath, '.js');
        return filename.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('') + 'Utility';
    }

    processComponent(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const componentName = this.getComponentName(filePath);
        
        // Parse the JSX component
        const component = this.parseJSXComponent(content, componentName, filePath);
        this.components.set(componentName, component);
    }

    parseJSXComponent(content, componentName, filePath) {
        // Extract the actual function name from the content
        const functionMatch = content.match(/function\s+(\w+)\s*\(/);
        const actualFunctionName = functionMatch ? functionMatch[1] : componentName;
        
        const component = {
            name: componentName,
            actualFunctionName: actualFunctionName,
            content: content,
            filePath: filePath
        };
        
        return component;
    }

    getComponentName(filePath) {
        const filename = path.basename(filePath, '.glint.js');
        return filename.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('') + 'Component';
    }

    generateBundle() {
        let output = this.generateRuntime();
        
        // Add utilities first (so they're available to everything else)
        this.utilities.forEach(utility => {
            output += '\n\n// Utility: ' + utility.filePath + '\n';
            output += utility.content;
        });
        
        // Add each store
        this.stores.forEach(store => {
            output += '\n\n' + store.content;
        });
        
        // Add each component
        this.components.forEach(component => {
            output += '\n\n' + this.generateComponentCode(component);
        });
        
        // Write the bundle
        fs.writeFileSync(path.join(this.outputDir, 'glint-bundle.js'), output);
        
        // Process HTML files
        this.processHtmlFiles();
    }

    generateRuntime() {
        return `/**
 * Glint Framework v2.0 - Clean Function Components
 */

// HTML tagged template literal (provides syntax highlighting)
function html(strings, ...values) {
    let result = '';
    for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
            const value = values[i];
            result += (value != null) ? String(value) : '';
        }
    }
    return result;
}

// Legacy JSX helper (deprecated - use html\`\` instead)
function jsx(strings, ...values) {
    console.warn('jsx\`\` is deprecated. Use html\`\` for better syntax highlighting.');
    return html(strings, ...values);
}

// Named stores for state management
const namedStores = new Map();

function createStore(name, initialState = {}, actions = {}) {
    if (!namedStores.has(name)) {
        const store = {
            state: initialState,
            actions: {},
            subscribers: new Set(),
            
            getState() {
                return this.state;
            },
            
            setState(updates) {
                if (typeof updates === 'function') {
                    this.state = { ...this.state, ...updates(this.state) };
                } else {
                    this.state = { ...this.state, ...updates };
                }
                this.notifySubscribers();
            },
            
            setActions(actions) {
                // Bind actions with get/set helpers
                Object.keys(actions).forEach(key => {
                    this.actions[key] = (...args) => {
                        const get = () => this.getState();
                        const set = (updates) => this.setState(updates);
                        return actions[key](get, set, ...args);
                    };
                });
            },
            
            notifySubscribers() {
                this.subscribers.forEach(callback => callback());
            },
            
            subscribe(callback) {
                this.subscribers.add(callback);
                return () => this.subscribers.delete(callback);
            }
        };
        
        store.setActions(actions);
        namedStores.set(name, store);
    }
    
    return namedStores.get(name);
}

// Current component context
let currentComponent = null;
let stateIndex = 0;

// Hook to capture handlers automatically
function useHandlers(handlers) {
    if (!window._glintHandlers) {
        window._glintHandlers = {};
    }
    Object.assign(window._glintHandlers, handlers);
}

// Named store hook - useStore('storeName', initialState, actions) 
function useStore(storeName, initialState = {}, actions = {}) {
    const component = currentComponent;
    
    if (typeof storeName !== 'string') {
        throw new Error('useStore requires a store name as the first parameter: useStore("storeName", initialState, actions)');
    }
    
    const store = createStore(storeName, initialState, actions);
    
    // Subscribe component to this specific store
    const subscriptionKey = '_' + storeName + 'Subscribed';
    const unsubscribeKey = '_' + storeName + 'Unsubscribe';
    
    if (component && !component[subscriptionKey]) {
        component[subscriptionKey] = true;
        component[unsubscribeKey] = store.subscribe(() => component._render());
    }
    
    return [store.getState(), store.actions];
}

// Local component state hook
function useState(initialValue) {
    const component = currentComponent;
    const index = stateIndex++;
    
    if (!component._states) component._states = [];
    if (component._states[index] === undefined) {
        component._states[index] = initialValue;
    }
    
    const setState = (newValue) => {
        if (typeof newValue === 'function') {
            component._states[index] = newValue(component._states[index]);
        } else {
            component._states[index] = newValue;
        }
        component._render();
    };
    
    return [component._states[index], setState];
}

// Clean function component wrapper  
function createComponent(componentFunc, tagName) {
    return class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._states = [];
        }
        
        connectedCallback() {
            this._render();
        }
        
        disconnectedCallback() {
            // Cleanup all store subscriptions to prevent memory leaks
            Object.keys(this).forEach(key => {
                if (key.endsWith('Unsubscribe') && typeof this[key] === 'function') {
                    this[key]();
                    this[key] = null;
                }
            });
        }
        
        attributeChangedCallback() {
            this._render();
        }
        
        static get observedAttributes() {
            // Observe all attributes for props
            return Array.from(document.querySelectorAll(tagName) || [])
                .flatMap(el => Array.from(el.attributes))
                .map(attr => attr.name)
                .filter((name, index, self) => self.indexOf(name) === index);
        }
        
        _getProps() {
            const props = {};
            Array.from(this.attributes).forEach(attr => {
                // Convert kebab-case to camelCase
                const propName = attr.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                props[propName] = attr.value;
            });
            return props;
        }
        
        _render() {
            currentComponent = this;
            stateIndex = 0;
            
            // Initialize handlers object for this component
            window._glintHandlers = {};
            
            const props = this._getProps();
            const html = componentFunc(props);
            this.shadowRoot.innerHTML = html;
            this._bindEvents(window._glintHandlers || {});
            
            currentComponent = null;
        }
        
        _bindEvents(handlers) {
            // Define all supported events
            const eventTypes = [
                // Mouse Events
                'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 
                'onmouseout', 'onmousemove', 'onmouseenter', 'onmouseleave',
                
                // Form Events
                'onchange', 'oninput', 'onsubmit', 'onfocus', 'onblur', 'onselect',
                'onreset', 'oninvalid',
                
                // Keyboard Events
                'onkeydown', 'onkeyup', 'onkeypress',
                
                // Touch Events (for mobile)
                'ontouchstart', 'ontouchend', 'ontouchmove', 'ontouchcancel',
                
                // Drag Events
                'ondragstart', 'ondrag', 'ondragenter', 'ondragover', 
                'ondragleave', 'ondrop', 'ondragend',
                
                // Media Events
                'onloadstart', 'onloadeddata', 'onloadedmetadata', 'oncanplay',
                'oncanplaythrough', 'onplay', 'onpause', 'onended', 'onvolumechange',
                
                // Window/Document Events
                'onload', 'onerror', 'onresize', 'onscroll', 'onunload',
                
                // Other useful events
                'oncontextmenu', 'onwheel', 'onanimationstart', 'onanimationend',
                'ontransitionstart', 'ontransitionend'
            ];
            
            // Bind all event types
            eventTypes.forEach(eventType => {
                const eventName = eventType.substring(2); // Remove 'on' prefix
                const selector = '[' + eventType + ']';
                
                this.shadowRoot.querySelectorAll(selector).forEach(el => {
                    const handlerName = el.getAttribute(eventType);
                    el.removeAttribute(eventType);
                    
                    // Try to find handler from useHandlers or global scope
                    const handler = handlers[handlerName] || 
                                   window[handlerName] || 
                                   (window._glintHandlers && window._glintHandlers[handlerName]);
                    
                    if (handler && typeof handler === 'function') {
                        el.addEventListener(eventName, handler);
                    } else {
                        console.warn(eventType + ' handler "' + handlerName + '" not found');
                    }
                });
            });
        }
    };
}

window.html = html;
window.jsx = jsx;
window.useState = useState;
window.useStore = useStore;
window.useHandlers = useHandlers;
window.createComponent = createComponent;
`;
    }

    generateComponentCode(component) {
        // Super simple: just wrap the function component
        const tagName = this.getTagName(component.name);
        const functionName = component.actualFunctionName || component.name;
        
        return `
// Component: ${component.name}
${component.content}

// Auto-register as web component
customElements.define('${tagName}', createComponent(${functionName}, '${tagName}'));
`;
    }

    getTagName(componentName) {
        // Convert ComponentName to component-name
        return componentName
            .replace(/Component$/, '')
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .substring(1);
    }

    processHtmlFiles() {
        // Standard Glint project structure: src/index.html is required
        const htmlFile = 'src/index.html';
        
        if (!fs.existsSync(htmlFile)) {
            console.error('❌ Required file src/index.html not found!');
            console.log('📁 Glint projects must have src/index.html as the entry point');
            return;
        }
        
        let content = fs.readFileSync(htmlFile, 'utf8');
        
        // Inject the bundle script
        if (!content.includes('glint-bundle.js')) {
            content = content.replace(
                '</head>',
                '  <script src="build/glint-bundle.js"></script>\n</head>'
            );
        }
        
        // Auto-inject hot reload script in watch mode (dev only)
        if (this.watchMode && !content.includes('ws://localhost:3000')) {
            const hotReloadScript = `
    <script>
        // Auto-reload in dev mode (injected by Glint compiler)
        const ws = new WebSocket('ws://localhost:3000');
        ws.onmessage = (event) => {
            if (event.data === 'reload') {
                location.reload();
            }
        };
    </script>`;
            
            content = content.replace('</body>', hotReloadScript + '\n</body>');
        }
        
        fs.writeFileSync(path.join(this.outputDir, 'index.html'), content);
    }

    startWatcher() {
        console.log('👀 Watching for file changes...');
        
        chokidar.watch(['src/**/*.glint.js', 'src/**/*.store.js', 'src/**/*.js'], { 
            ignoreInitial: true,
            ignored: /node_modules/ // Ignore node_modules
        })
            .on('change', () => {
                console.log('🔄 File changed, rebuilding...');
                this.build(false).then(() => {
                    console.log('✅ Rebuild complete!');
                    this.notifyReload();
                });
            });
    }

    startDevServer() {
        const server = http.createServer((req, res) => {
            let filePath = '.' + req.url;
            if (filePath === './') {
                filePath = './build/index.html';
            }
            
            if (fs.existsSync(filePath)) {
                const ext = path.extname(filePath);
                const contentType = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css'
                }[ext] || 'text/plain';
                
                res.writeHead(200, { 'Content-Type': contentType });
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.writeHead(404);
                res.end('Not found');
            }
        });
        
        this.wss = new WebSocket.Server({ server });
        server.listen(3000, () => {
            console.log('🔥 Glint dev server running at http://localhost:3000/');
        });
    }

    notifyReload() {
        if (this.wss) {
            this.wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('reload');
                }
            });
        }
    }
}

// CLI
const watchMode = process.argv.includes('--watch') || process.argv.includes('-w');
new GlintCompiler().build(watchMode).catch(error => {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
});

module.exports = { GlintCompiler };
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
        this.outputDir = 'build';
        this.componentFiles = [];
    }

    async build(watchMode = false) {
        this.watchMode = watchMode; // Store for use in other methods
        
        console.log('🚀 Glint v2.0 - Building JSX Components...');
        
        // Ensure build directory exists
        fs.mkdirSync(this.outputDir, { recursive: true });
        
        // Find all component files (.glint.js)
        this.componentFiles = this.findComponentFiles('src');
        
        if (this.componentFiles.length === 0) {
            console.log('No .glint.js component files found in src/ directory');
            return;
        }

        // Process each component
        this.componentFiles.forEach(file => this.processComponent(file));
        
        // Generate the bundle
        this.generateBundle();
        
        console.log(`✅ Built ${this.componentFiles.length}/${this.componentFiles.length} components successfully!`);

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

// Current component context
let currentComponent = null;
let stateIndex = 0;

// Hook to capture handlers automatically
function useHandlers(handlers) {
    if (window._glintHandlers) {
        Object.assign(window._glintHandlers, handlers);
    }
}

// useState hook
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
            
            // Create a proxy to capture function declarations
            const handlers = {};
            const originalConsole = console.log;
            
            // Override console temporarily to capture handler assignments
            window._glintHandlers = handlers;
            
            const props = this._getProps();
            const html = componentFunc(props);
            this.shadowRoot.innerHTML = html;
            this._bindEvents(handlers);
            
            currentComponent = null;
        }
        
        _bindEvents(handlers) {
            this.shadowRoot.querySelectorAll('[onclick]').forEach(el => {
                const handlerName = el.getAttribute('onclick');
                el.removeAttribute('onclick');
                
                // Try to find handler from useHandlers or global scope
                const handler = handlers[handlerName] || window[handlerName];
                if (handler && typeof handler === 'function') {
                    el.onclick = handler;
                } else {
                    console.warn(\`Handler '\${handlerName}' not found\`);
                }
            });
        }
    };
}

window.html = html;
window.jsx = jsx;
window.useState = useState;
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
        
        chokidar.watch(['src/**/*.glint.js'], { ignoreInitial: true })
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
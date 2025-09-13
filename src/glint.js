#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const http = require('http');
const WebSocket = require('ws');
const cheerio = require('cheerio');

class GlintCompiler {
    constructor() {
        this.components = new Map();
        this.outputDir = 'build';
    }

    async build(watchMode = false) {
        console.log('🚀 Building Glint components...');
        
        fs.mkdirSync(this.outputDir, { recursive: true });
        
        const glintFiles = this.findGlintFiles('src');
        if (glintFiles.length === 0) {
            console.log('No .glint files found in src/ directory');
            return;
        }

        glintFiles.forEach(file => this.processComponent(file));
        this.generateBundle();
        
        console.log(`✅ Built ${glintFiles.length} components successfully!`);

        if (watchMode) this.startWatcher();
    }

    findGlintFiles(dir) {
        if (!fs.existsSync(dir)) return [];
        
        return fs.readdirSync(dir, { withFileTypes: true })
            .flatMap(entry => {
                const fullPath = path.join(dir, entry.name);
                return entry.isDirectory() 
                    ? this.findGlintFiles(fullPath)
                    : entry.name.endsWith('.glint') ? [fullPath] : [];
            });
    }

    processComponent(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const name = this.getComponentName(filePath);
        
        // Use cheerio for proper parsing
        const $ = cheerio.load(content, { 
            xmlMode: true,
            decodeEntities: false 
        });
        
        let template = $('template').html() || '';
        const script = $('script').html() || '';
        const style = $('style').html() || '';
        
        // Static analysis: Check for problematic patterns
        this.validateComponentScript(script, filePath);
        
        // Auto-wrap custom elements in divs for better rendering
        template = this.wrapCustomElements(template);
        
        // Extract reactive vars from script (variables assigned with this.variable = )
        const reactiveVars = [...new Set(
            (script.match(/this\.(\w+)\s*=/g) || [])
                .map(match => match.match(/this\.(\w+)/)[1])
        )];
        
        // Extract props (export let declarations) with their default values
        const propMatches = script.match(/export\s+let\s+(\w+)\s*=\s*([^;]+)/g) || [];
        const props = [];
        const propDefaults = {};
        
        propMatches.forEach(match => {
            const fullMatch = match.match(/export\s+let\s+(\w+)\s*=\s*([^;]+)/);
            if (fullMatch) {
                const propName = fullMatch[1];
                const defaultValue = fullMatch[2].trim();
                props.push(propName);
                propDefaults[propName] = defaultValue;
            }
        });
        
        // Also catch export let without default values
        const simpleProps = (script.match(/export\s+let\s+(\w+)\s*;/g) || [])
            .map(match => match.match(/export\s+let\s+(\w+)/)[1])
            .filter(prop => !props.includes(prop));
        
        props.push(...simpleProps);
        
        this.components.set(name, { name, template, script, style, reactiveVars, props, propDefaults });
    }

    validateComponentScript(script, filePath) {
        let hasErrors = false;
        
        // Check for createHooks usage in component
        const createHooksPattern = /createHooks\s*\(/g;
        const hooksMatches = script.match(createHooksPattern);
        
        if (hooksMatches) {
            console.error(`\n🚫 GLINT COMPILE ERROR in ${filePath}:`);
            console.error(`   Found ${hooksMatches.length} usage(s) of createHooks() in component`);
            console.error(`   This causes memory leaks when components are destroyed.`);
            console.error(`\n💡 Solution:`);
            console.error(`   Replace: createHooks('stateName', { ... })`);
            console.error(`   With:    this.onStateChange('stateName', 'property', callback) inside onMounted()`);
            console.error(`\n📖 Learn more: https://glint-docs.example.com/hooks#component-hooks\n`);
            hasErrors = true;
        }
        
        // Check for createState usage in component
        const createStatePattern = /createState\s*\(/g;
        const stateMatches = script.match(createStatePattern);
        
        if (stateMatches) {
            console.error(`\n🚫 GLINT COMPILE ERROR in ${filePath}:`);
            console.error(`   Found ${stateMatches.length} usage(s) of createState() in component`);
            console.error(`   Components should consume states, not create them.`);
            console.error(`\n💡 Solution:`);
            console.error(`   Replace: createState('stateName', { ... })`);
            console.error(`   With:    getState('stateName') (after creating state in separate JS file)`);
            console.error(`\n📖 Create global states in separate JS files, not in components.\n`);
            hasErrors = true;
        }
        
        // Check for createActions usage in component
        const createActionsPattern = /createActions\s*\(/g;
        const actionsMatches = script.match(createActionsPattern);
        
        if (actionsMatches) {
            console.error(`\n🚫 GLINT COMPILE ERROR in ${filePath}:`);
            console.error(`   Found ${actionsMatches.length} usage(s) of createActions() in component`);
            console.error(`   Components should use actions, not create them.`);
            console.error(`\n💡 Solution:`);
            console.error(`   Replace: createActions('actionsName', { ... })`);
            console.error(`   With:    getActions('actionsName') (after creating actions in separate JS file)`);
            console.error(`\n📖 Create global actions in separate JS files, not in components.\n`);
            hasErrors = true;
        }
        
        // Check for other problematic patterns
        const windowAssignPattern = /window\.\w+\s*=/g;
        const windowMatches = script.match(windowAssignPattern);
        
        if (windowMatches) {
            console.warn(`\n⚠️ GLINT WARNING in ${filePath}:`);
            console.warn(`   Found window assignments in component. Consider using global state instead.`);
            console.warn(`   Global variables can cause conflicts and are hard to track.\n`);
        }
        
        // If any errors were found, stop the build in development
        if (hasErrors && process.env.NODE_ENV !== 'production') {
            throw new Error(`Compilation failed due to architectural violations in component.`);
        }
    }

    wrapCustomElements(template) {
        if (!template.trim()) return template;
        
        // Use cheerio to parse and modify the template
        const $ = cheerio.load(`<div>${template}</div>`, { 
            xmlMode: true,
            decodeEntities: false 
        });
        
        // Find all custom elements (elements with hyphens in their tag names)
        $('*').each(function() {
            const tagName = this.tagName ? this.tagName.toLowerCase() : '';
            if (tagName && tagName.includes('-')) {
                // Check if it's not already wrapped in a div
                const parent = $(this).parent();
                const isDirectlyInDiv = parent.length === 1 && parent[0].tagName === 'div' && parent.children().length === 1;
                
                if (!isDirectlyInDiv) {
                    // Wrap the custom element in a div
                    $(this).wrap('<div></div>');
                }
            }
        });
        
        // Return the inner HTML (without the wrapper div we added)
        return $('div').html() || template;
    }

    getComponentName(filePath) {
        return path.basename(filePath, '.glint')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('') + 'Component';
    }

    generateBundle() {
        let output = this.generateRuntime();
        this.components.forEach((component, name) => {
            output += this.generateComponent(component);
        });
        
        fs.writeFileSync(path.join(this.outputDir, 'glint-components.js'), output);
        
        // Process HTML files and inject script tags
        this.processHtmlFiles();
    }

    processHtmlFiles() {
        // Find all HTML files in the project root
        const htmlFiles = ['index.html', 'src/index.html'].filter(file => fs.existsSync(file));
        
        htmlFiles.forEach(htmlFile => {
            const content = fs.readFileSync(htmlFile, 'utf8');
            const $ = cheerio.load(content);
            
            // Remove any existing glint or user script tags to avoid duplicates
            $('script[src*="glint-components"]').remove();
            $('script[src*="user.js"]').remove();
            $('script[src*=".js"]').remove(); // Remove any .js scripts to avoid duplicates
            
            // Get all JavaScript files that will be copied to build
            const jsFiles = this.getJavaScriptFilesToInclude();
            
            // Create script tags - glint-components.js first, then all user JS files
            const scriptTags = ['<script src="glint-components.js"></script>'];
            
            // Add all user JavaScript files
            jsFiles.forEach(jsFile => {
                scriptTags.push(`<script src="${jsFile}"></script>`);
            });
            
            // Add all scripts at once to maintain order
            $('head').append(scriptTags.join('\n'));
            
            // Write to build directory
            const outputPath = path.join(this.outputDir, path.basename(htmlFile));
            fs.writeFileSync(outputPath, $.html());
        });
        
        // Bundle all .js files into a single user-bundle.js
        this.bundleJavaScriptFiles();
        
        // Validate no duplicate state/action names across all JS files
        this.validateGlobalStateActions();
    }
    
    getJavaScriptFilesToInclude() {
        // Check if we have any JavaScript files to bundle
        const hasJsFiles = this.hasJavaScriptFiles();
        
        if (hasJsFiles) {
            return ['user-bundle.js'];
        }
        
        return [];
    }
    
    hasJavaScriptFiles() {
        // Check root directory
        try {
            const rootFiles = fs.readdirSync('.');
            const hasRootJs = rootFiles.some(file => file.endsWith('.js') && fs.statSync(file).isFile());
            if (hasRootJs) return true;
        } catch (error) {
            // Ignore errors
        }
        
        // Check src directory
        if (fs.existsSync('src')) {
            const srcFiles = this.findJavaScriptFiles('src');
            return srcFiles.length > 0;
        }
        
        return false;
    }
    
    bundleJavaScriptFiles() {
        try {
            const jsFiles = [];
            const bundleContent = [];
            
            // Check root directory for .js files
            const rootFiles = fs.readdirSync('.');
            rootFiles.forEach(file => {
                if (file.endsWith('.js') && fs.statSync(file).isFile()) {
                    jsFiles.push(file);
                }
            });
            
            // Check src directory for .js files (recursively)
            if (fs.existsSync('src')) {
                const srcFiles = this.findJavaScriptFiles('src');
                srcFiles.forEach(({ source }) => {
                    jsFiles.push(source);
                });
            }
            
            if (jsFiles.length === 0) {
                console.log('📦 No JavaScript files found to bundle');
                return;
            }
            
            // Read and concatenate all JS files
            jsFiles.forEach(filePath => {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    bundleContent.push(`// === ${filePath} ===`);
                    bundleContent.push(content);
                    bundleContent.push(''); // Empty line for separation
                    console.log(`📄 Bundled: ${filePath}`);
                } catch (error) {
                    console.warn(`⚠️ Warning: Could not read ${filePath}: ${error.message}`);
                }
            });
            
            // Write the bundled file
            const bundlePath = path.join(this.outputDir, 'user-bundle.js');
            fs.writeFileSync(bundlePath, bundleContent.join('\n'));
            
            console.log(`✅ Created user-bundle.js with ${jsFiles.length} file(s)`);
            
        } catch (error) {
            console.warn(`⚠️ Warning: Could not bundle JavaScript files: ${error.message}`);
        }
    }
    
    findJavaScriptFiles(dir, currentPath = '') {
        const jsFiles = [];
        
        try {
            const items = fs.readdirSync(dir);
            
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Recursively search subdirectories
                    const subPath = currentPath ? `${currentPath}_${item}` : item;
                    const subFiles = this.findJavaScriptFiles(fullPath, subPath);
                    jsFiles.push(...subFiles);
                } else if (item.endsWith('.js')) {
                    // Create flattened filename: src_user_users.js
                    const flattenedName = currentPath ? 
                        `${currentPath}_${item}` : 
                        item;
                    
                    jsFiles.push({
                        source: fullPath,
                        target: flattenedName
                    });
                }
            });
        } catch (error) {
            console.warn(`Warning: Could not read directory ${dir}: ${error.message}`);
        }
        
        return jsFiles;
    }
    
    validateGlobalStateActions() {
        const stateDeclarations = new Map(); // stateName -> { file, line }
        const actionDeclarations = new Map(); // actionName -> { file, line }
        const hookDeclarations = new Map(); // hookName -> { file, line }
        
        // Get all JavaScript files that will be included
        const jsFiles = [];
        
        // Check root directory
        try {
            const rootFiles = fs.readdirSync('.');
            rootFiles.forEach(file => {
                if (file.endsWith('.js') && fs.statSync(file).isFile()) {
                    jsFiles.push(file);
                }
            });
        } catch (error) {
            // Ignore errors
        }
        
        // Check src directory (recursively)
        if (fs.existsSync('src')) {
            const srcFiles = this.findJavaScriptFiles('src');
            srcFiles.forEach(({ source }) => {
                jsFiles.push(source);
            });
        }
        
        // Scan each JavaScript file for createState, createActions, createHooks calls
        let hasErrors = false;
        
        jsFiles.forEach(filePath => {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n');
                
                lines.forEach((line, lineIndex) => {
                    // Check for createState calls
                    const stateMatch = line.match(/createState\s*\(\s*['"`]([^'"`]+)['"`]/);
                    if (stateMatch) {
                        const stateName = stateMatch[1];
                        if (stateDeclarations.has(stateName)) {
                            const existing = stateDeclarations.get(stateName);
                            console.error(`\n🚫 GLINT COMPILE ERROR: Duplicate state '${stateName}'`);
                            console.error(`   First declared in:  ${existing.file}:${existing.line}`);
                            console.error(`   Duplicate found in: ${filePath}:${lineIndex + 1}`);
                            console.error(`\n💡 Solution: Each state must have a unique name across all JS files.\n`);
                            hasErrors = true;
                        } else {
                            stateDeclarations.set(stateName, { file: filePath, line: lineIndex + 1 });
                        }
                    }
                    
                    // Check for createActions calls
                    const actionsMatch = line.match(/createActions\s*\(\s*['"`]([^'"`]+)['"`]/);
                    if (actionsMatch) {
                        const actionName = actionsMatch[1];
                        if (actionDeclarations.has(actionName)) {
                            const existing = actionDeclarations.get(actionName);
                            console.error(`\n🚫 GLINT COMPILE ERROR: Duplicate actions '${actionName}'`);
                            console.error(`   First declared in:  ${existing.file}:${existing.line}`);
                            console.error(`   Duplicate found in: ${filePath}:${lineIndex + 1}`);
                            console.error(`\n💡 Solution: Each action group must have a unique name across all JS files.\n`);
                            hasErrors = true;
                        } else {
                            actionDeclarations.set(actionName, { file: filePath, line: lineIndex + 1 });
                        }
                    }
                    
                    // Check for createHooks calls
                    const hooksMatch = line.match(/createHooks\s*\(\s*['"`]([^'"`]+)['"`]/);
                    if (hooksMatch) {
                        const hookName = hooksMatch[1];
                        if (hookDeclarations.has(hookName)) {
                            const existing = hookDeclarations.get(hookName);
                            console.error(`\n🚫 GLINT COMPILE ERROR: Duplicate hooks '${hookName}'`);
                            console.error(`   First declared in:  ${existing.file}:${existing.line}`);
                            console.error(`   Duplicate found in: ${filePath}:${lineIndex + 1}`);
                            console.error(`\n💡 Solution: Each hook group must have a unique name across all JS files.\n`);
                            hasErrors = true;
                        } else {
                            hookDeclarations.set(hookName, { file: filePath, line: lineIndex + 1 });
                        }
                    }
                });
            } catch (error) {
                console.warn(`⚠️ Warning: Could not read ${filePath}: ${error.message}`);
            }
        });
        
        // If any duplicates were found, stop the build
        if (hasErrors) {
            if (process.env.NODE_ENV !== 'production') {
                throw new Error(`Build failed: Duplicate state/action/hook names detected.`);
            }
        }
        
        // Log summary of declarations found
        if (stateDeclarations.size > 0 || actionDeclarations.size > 0 || hookDeclarations.size > 0) {
            console.log(`\n📊 Global declarations found:`);
            if (stateDeclarations.size > 0) {
                console.log(`   States:  ${Array.from(stateDeclarations.keys()).join(', ')}`);
            }
            if (actionDeclarations.size > 0) {
                console.log(`   Actions: ${Array.from(actionDeclarations.keys()).join(', ')}`);
            }
            if (hookDeclarations.size > 0) {
                console.log(`   Hooks:   ${Array.from(hookDeclarations.keys()).join(', ')}`);
            }
            console.log('');
        }
    }

    generateRuntime() {
        return `// Glint Framework Runtime - Tiny & Clean
// Global State System (similar to Vue 3 Composition API)
const GlintStates = new Map();
const GlintActions = new Map();
const GlintHooks = new Map();
let currentComponent = null;

function createState(name, initialState) {
    // Detect if we're being called from within a component context
    if (currentComponent) {
        console.error(\`🚫 GLINT ERROR: createState() called inside component '\${currentComponent.constructor.name}'\`);
        console.error(\`💡 Use 'getState("\${name}")' instead to access existing state.\`);
        console.error(\`📖 Global states should be created in separate JS files, not in components.\`);
        
        // In development, throw an error to prevent the mistake
        if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
            throw new Error(\`createState() not allowed in components. Use getState() instead.\`);
        }
        
        // In production, just warn and return existing state if it exists
        if (GlintStates.has(name)) {
            return GlintStates.get(name);
        }
        return null;
    }
    
    if (GlintStates.has(name)) {
        return GlintStates.get(name);
    }
    
    const subscribers = new Set();
    const hooks = new Map(); // Map of property name -> Set of hook functions
    
    const state = {
        _state: { ...initialState },
        _subscribers: subscribers,
        _hooks: hooks,
        
        // Subscribe a component to state updates
        subscribe(component) {
            subscribers.add(component);
        },
        
        // Unsubscribe a component
        unsubscribe(component) {
            subscribers.delete(component);
        },
        
        // Add a hook for a specific property
        addHook(property, hookFunction) {
            if (!hooks.has(property)) {
                hooks.set(property, new Set());
            }
            hooks.get(property).add(hookFunction);
        },
        
        // Remove a hook
        removeHook(property, hookFunction) {
            if (hooks.has(property)) {
                hooks.get(property).delete(hookFunction);
            }
        },
        
        // Notify all subscribed components
        _notify() {
            subscribers.forEach(component => {
                if (component.render) {
                    component.render();
                    component._bindEvents();
                }
            });
        },
        
        // Call hooks for a specific property
        _callHooks(property, newValue, oldValue) {
            if (hooks.has(property)) {
                hooks.get(property).forEach(hookFn => {
                    try {
                        hookFn(newValue, oldValue, property);
                    } catch (error) {
                        console.error(\`Hook error for \${name}.\${property}:\`, error);
                    }
                });
            }
        }
    };
    
    // Create reactive proxy for the state
    const reactiveState = new Proxy(state._state, {
        get(target, key) {
            // Auto-subscribe current component
            if (currentComponent && !subscribers.has(currentComponent)) {
                state.subscribe(currentComponent);
            }
            return target[key];
        },
        
        set(target, key, value) {
            if (target[key] !== value) {
                const oldValue = target[key];
                target[key] = value;
                
                // Call hooks first
                state._callHooks(key, value, oldValue);
                
                // Then notify components
                state._notify();
            }
            return true;
        }
    });
    
    // Store the state object with the reactive proxy for hook access
    reactiveState._glintState = state;
    
    GlintStates.set(name, reactiveState);
    
    // Auto-register to window for easy access
    if (!window.glintStates) window.glintStates = {};
    window.glintStates[name] = reactiveState;
    
    return reactiveState;
}

function createActions(name, actionFunctions) {
    // Detect if we're being called from within a component context
    if (currentComponent) {
        console.error(\`🚫 GLINT ERROR: createActions() called inside component '\${currentComponent.constructor.name}'\`);
        console.error(\`💡 Use 'getActions("\${name}")' instead to access existing actions.\`);
        console.error(\`📖 Global actions should be created in separate JS files, not in components.\`);
        
        // In development, throw an error to prevent the mistake
        if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
            throw new Error(\`createActions() not allowed in components. Use getActions() instead.\`);
        }
        
        // In production, just warn and return existing actions if they exist
        if (GlintActions.has(name)) {
            return GlintActions.get(name);
        }
        return null;
    }
    
    if (GlintActions.has(name)) {
        return GlintActions.get(name);
    }
    
    GlintActions.set(name, actionFunctions);
    
    // Auto-register to window for easy access
    if (!window.glintActions) window.glintActions = {};
    window.glintActions[name] = actionFunctions;
    
    return actionFunctions;
}

function createHooks(stateName, hooks) {
    // Detect if we're being called from within a component context
    if (currentComponent) {
        console.error(\`🚫 GLINT ERROR: createHooks() called inside component '\${currentComponent.constructor.name}'\`);
        console.error(\`💡 Use 'this.onStateChange()' in onMounted() instead to prevent memory leaks.\`);
        console.error(\`📖 See: https://glint-docs.example.com/hooks#component-hooks\`);
        
        // In development, throw an error to prevent the mistake
        if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
            throw new Error(\`createHooks() not allowed in components. Use onStateChange() instead.\`);
        }
        
        // In production, just warn and return null
        return null;
    }
    
    const state = getState(stateName);
    if (!state || !state._glintState) {
        console.error(\`State '\${stateName}' not found. Make sure to call createState first.\`);
        return null;
    }
    
    const hookFunctions = {};
    
    // Register each hook
    Object.entries(hooks).forEach(([property, hookFunction]) => {
        if (typeof hookFunction === 'function') {
            state._glintState.addHook(property, hookFunction);
            hookFunctions[property] = hookFunction;
        }
    });
    
    // Store hooks for cleanup if needed
    if (!GlintHooks.has(stateName)) {
        GlintHooks.set(stateName, new Map());
    }
    
    const stateHooks = GlintHooks.get(stateName);
    Object.entries(hookFunctions).forEach(([property, hookFn]) => {
        if (!stateHooks.has(property)) {
            stateHooks.set(property, new Set());
        }
        stateHooks.get(property).add(hookFn);
    });
    
    return hookFunctions;
}

function getState(name) {
    return window.glintStates?.[name] || null;
}

function getActions(name) {
    return window.glintActions?.[name] || null;
}

function getHooks(name) {
    return GlintHooks.get(name) || null;
}

// Export for global use
window.createState = createState;
window.createActions = createActions;
window.createHooks = createHooks;
window.getState = getState;
window.getActions = getActions;
window.getHooks = getHooks;

// Backward compatibility
window.createStore = createState;

class GlintElement extends HTMLElement {
    constructor() {
        super();
        // Only use Shadow DOM if not explicitly disabled
        if (this.constructor.useShadowDOM !== false) {
            this.attachShadow({ mode: 'open' });
        }
        this._reactiveData = {};
        this._componentHooks = new Map(); // Component-specific hooks
        this._setupReactivity();
    }
    
    // Component-level hook system
    onStateChange(stateName, property, callback) {
        const state = getState(stateName);
        if (!state || !state._glintState) {
            console.error(\`State '\${stateName}' not found\`);
            return;
        }
        
        // Create a wrapper that includes component context
        const wrappedCallback = (newValue, oldValue, prop) => {
            callback.call(this, newValue, oldValue, prop);
        };
        
        // Add the hook to the state
        state._glintState.addHook(property, wrappedCallback);
        
        // Track for cleanup
        if (!this._componentHooks.has(stateName)) {
            this._componentHooks.set(stateName, new Map());
        }
        if (!this._componentHooks.get(stateName).has(property)) {
            this._componentHooks.get(stateName).set(property, new Set());
        }
        this._componentHooks.get(stateName).get(property).add(wrappedCallback);
        
        return wrappedCallback;
    }
    
    connectedCallback() {
        this._initializeData();
        this._setupProps();
        this.render();
        this._bindEvents();
        
        // Call component lifecycle hook if it exists
        if (typeof this.onMounted === 'function') {
            this.onMounted();
        }
    }
    
    disconnectedCallback() {
        // Clean up component-specific hooks
        this._componentHooks.forEach((properties, stateName) => {
            const state = getState(stateName);
            if (state && state._glintState) {
                properties.forEach((hooks, property) => {
                    hooks.forEach(hook => {
                        state._glintState.removeHook(property, hook);
                    });
                });
            }
        });
        this._componentHooks.clear();
        
        // Unsubscribe from all states when component is removed
        GlintStates.forEach(state => {
            if (state._subscribers) {
                state._subscribers.delete(this);
            }
        });
        
        // Call component lifecycle hook if it exists
        if (typeof this.onUnmounted === 'function') {
            this.onUnmounted();
        }
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) this[name] = newValue;
    }
    
    _setupReactivity() {
        this._getReactiveVars().forEach(varName => {
            Object.defineProperty(this, varName, {
                get() { return this._reactiveData[varName]; },
                set(value) {
                    if (this._reactiveData[varName] !== value) {
                        this._reactiveData[varName] = value;
                        this.render();
                        this._bindEvents();
                    }
                }
            });
        });
    }
    
    _setupProps() {
        for (const { name, value } of Array.from(this.attributes)) {
            const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), name);
            if (desc && typeof desc.value === 'function') continue;
            this[name] = value;
        }
    }
    
    _bindEvents() {
        const root = this.shadowRoot || this;
        const events = ['click', 'change', 'input', 'submit', 'blur'];
        events.forEach(eventName => {
            const eventAttr = \`on\${eventName}\`;
            root.querySelectorAll(\`[\${eventAttr}]\`).forEach(el => {
                if (el._glintBound && el._glintBound.has(eventName)) return;
                const handler = el.getAttribute(eventAttr);
                
                // Check for method with parameters: this.methodName(event) or this.methodName()
                const methodMatch = handler && handler.match(/^\\s*this\\.([a-zA-Z_]\\w*)\\s*\\(([^)]*)\\)\\s*$/);
                if (methodMatch) {
                    const methodName = methodMatch[1];
                    const params = methodMatch[2].trim();
                    const method = this[methodName];
                    
                    if (typeof method === 'function') {
                        el.addEventListener(eventName, e => { 
                            if (eventName === 'submit') e.preventDefault();
                            // If method expects event parameter, pass it
                            if (params === 'event' || params === '') {
                                method.call(this, e);
                            } else {
                                // For other parameters, you could extend this
                                method.call(this, e);
                            }
                        });
                        if (!el._glintBound) el._glintBound = new Set();
                        el._glintBound.add(eventName);
                        el.removeAttribute(eventAttr);
                    }
                }
            });
        });
    }
    
    render() {
        // Set current component context for store auto-subscription
        currentComponent = this;
        
        const self = this;
        
        // Enhanced interpolation: supports full JavaScript expressions in {{ }}
        const html = this._template.replace(/\\{\\{([^}]+)\\}\\}/g, function(match, expr) {
            return self._evaluateExpression(expr.trim());
        });
        
        const styles = this._styles ? \`<style>\${this._styles}</style>\` : '';
        const next = styles + html;
        const root = this.shadowRoot || this;
        if (root._lastHTML !== next) {
            root.innerHTML = next;
            root._lastHTML = next;
            this._bindEvents(); // only when content actually changed
        }
        
        // Clear current component context
        currentComponent = null;
    }
    
    _evaluateExpression(expr) {
        try {
            // Create a safe evaluation context with component's 'this' binding
            const func = new Function('return (' + expr + ')');
            const result = func.call(this);
            
            // Convert result to string, handling different types appropriately
            if (result === null || result === undefined) {
                return '';
            } else if (typeof result === 'string') {
                return result;
            } else if (typeof result === 'boolean' || typeof result === 'number') {
                return String(result);
            } else if (Array.isArray(result)) {
                return result.join('');
            } else if (typeof result === 'object') {
                return JSON.stringify(result);
            } else {
                return String(result);
            }
        } catch (error) {
            console.error('Glint interpolation error:', error.message, 'in expression:', expr);
            return '<span style="color: red; font-weight: bold;">[Expression Error: ' + expr + ']</span>';
        }
    }
    
    _evaluateProperty(propPath) {
        try {
            // Handle special case for conditional expressions
            if (propPath.includes('?')) {
                // Simple ternary operator support
                const match = propPath.match(/^(.+?)\\s*\\?\\s*'([^']*)'\\s*:\\s*'([^']*)'$/);
                if (match) {
                    const condition = match[1];
                    const trueValue = match[2];
                    const falseValue = match[3];
                    const conditionResult = this._evaluateProperty(condition);
                    return conditionResult ? trueValue : falseValue;
                }
            }
            
            // Handle method calls like this.methodName()
            const methodMatch = propPath.match(/^this\\.([a-zA-Z_]\\w*)\\(\\s*\\)$/);
            if (methodMatch) {
                const methodName = methodMatch[1];
                const method = this[methodName];
                if (typeof method === 'function') {
                    return method.call(this);
                }
                return '';
            }
            
            return propPath.split('.').reduce(function(obj, prop) {
                return obj && obj[prop] !== undefined ? obj[prop] : undefined;
            }, this);
        } catch (e) { 
            return ''; 
        }
    }
    
    _getReactiveVars() { return []; }
    _initializeData() {}
    static get observedAttributes() { return []; }
}

`;
    }

    generateComponent(component) {
        // Generate tag name
        let tagName = component.name
            .replace(/Component$/, '')
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .substring(1);
        if (!tagName.includes('-')) tagName = 'glint-' + tagName;
        
        // Parse script content properly using a more robust approach
        const script = component.script.trim();
        
        // Remove export let statements
        const cleanScript = script.replace(/export\s+let\s+\w+\s*=\s*[^;]+;?/g, '').trim();
        
        // Check if this is a main component (should not use Shadow DOM)
        const isMainComponent = false; // Enable Shadow DOM for all components
        
        // Split script into tokens to properly parse methods vs initialization
        const initStatements = [];
        const methods = [];
        
        // Add prop default value assignments
        if (component.propDefaults) {
            Object.entries(component.propDefaults).forEach(([prop, defaultValue]) => {
                initStatements.push(`        this.${prop} = ${defaultValue};`);
            });
        }
        
        if (cleanScript) {
            // Use a simple line-by-line parser
            const lines = cleanScript.split('\n');
            let currentMethod = [];
            let braceCount = 0;
            let inMethod = false;
            let i = 0;
            
            while (i < lines.length) {
                const line = lines[i].trim();
                
                if (!inMethod && (line.match(/^function\s+(\w+)\s*\([^)]*\)\s*\{/) || line.match(/^(\w+)\s*\([^)]*\)\s*\{/))) {
                    // Start of a method (either function declaration or method shorthand)
                    inMethod = true;
                    
                    // Convert function declaration to method
                    let methodLine = line;
                    const functionMatch = line.match(/^function\s+(\w+)\s*\(([^)]*)\)\s*\{/);
                    if (functionMatch) {
                        methodLine = `${functionMatch[1]}(${functionMatch[2]}) {`;
                    }
                    
                    currentMethod = [methodLine];
                    braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                    
                    if (braceCount === 0) {
                        // Single line method
                        methods.push('    ' + methodLine);
                        inMethod = false;
                        currentMethod = [];
                    }
                } else if (inMethod) {
                    // Inside a method
                    currentMethod.push(line);
                    braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
                    
                    if (braceCount === 0) {
                        // End of method
                        const methodCode = currentMethod.map(l => l.trim() ? '    ' + l : l).join('\n');
                        methods.push(methodCode);
                        inMethod = false;
                        currentMethod = [];
                    }
                } else if (line && !line.startsWith('//')) {
                    // Initialization code
                    initStatements.push('        ' + line);
                }
                
                i++;
            }
        }
        
        return `class ${component.name} extends GlintElement {
    constructor() {
        super();
        this._template = \`${component.template.replace(/`/g, '\\`')}\`;
        this._styles = \`${component.style.replace(/`/g, '\\`')}\`;
    }
    
    _getReactiveVars() {
        return ${JSON.stringify(component.reactiveVars)};
    }
    
    _initializeData() {
        // Set current component context for hook detection
        currentComponent = this;
        try {
${initStatements.join('\n')}
        } finally {
            // Always clear the context
            currentComponent = null;
        }
    }
    
    static get observedAttributes() {
        return ${JSON.stringify(component.props)};
    }
    
${isMainComponent ? '    static useShadowDOM = false;\n' : ''}
${methods.join('\n')}
}

customElements.define('${tagName}', ${component.name});

`;
    }

    startWatcher() {
        console.log('👀 Watching for file changes...');
        this.startDevServer();
        
        chokidar.watch('src/**/*.glint', { persistent: true, ignoreInitial: true })
            .on('change', async (filePath) => {
                console.log(`🔄 File changed: ${filePath}`);
                this.processComponent(filePath);
                this.generateBundle();
                console.log('✅ Rebuild complete!');
                this.notifyReload();
            });
    }

    startDevServer() {
        const server = http.createServer((req, res) => {
            const routes = {
                '/': 'index.html',
                '/index.html': 'index.html'
            };
            
            let filePath = routes[req.url] || req.url.substring(1);
            // Serve files from the build directory
            const fullPath = path.join(this.outputDir, filePath);
            
            if (!fs.existsSync(fullPath)) {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            
            let content = fs.readFileSync(fullPath, 'utf8');
            
            const contentTypes = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css'
            };
            const ext = path.extname(filePath);
            const contentType = contentTypes[ext] || 'text/plain';
            
            if (contentType === 'text/html') {
                content = content.replace('</body>', `
    <script>
        const ws = new WebSocket('ws://localhost:3002');
        ws.onmessage = (event) => {
            if (event.data === 'reload') {
                console.log('🔄 Hot reloading...');
                location.reload();
            }
        };
        ws.onopen = () => console.log('🔌 Connected to Glint dev server');
    </script>
</body>`);
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });

        this.wss = new WebSocket.Server({ port: 3002 });
        
        server.listen(3000, () => {
            console.log('🔥 Glint dev server running at http://localhost:3000/');
        });
    }

    notifyReload() {
        this.wss?.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('reload');
            }
        });
    }
}

// CLI
const watchMode = process.argv.includes('--watch') || process.argv.includes('-w');
new GlintCompiler().build(watchMode).catch(error => {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
});

module.exports = { GlintCompiler };
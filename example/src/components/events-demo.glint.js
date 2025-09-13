function EventsDemo() {
    const [logs, setLogs] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [dragText, setDragText] = useState('Drag me around!');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [keyPressed, setKeyPressed] = useState('');
    const [focusState, setFocusState] = useState('');

    const addLog = (eventType, detail = '') => {
        const timestamp = new Date().toLocaleTimeString();
        const newLog = `[${timestamp}] ${eventType}${detail ? ': ' + detail : ''}`;
        setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10 logs
    };

    useHandlers({
        // Mouse Events
        handleClick: () => addLog('Click'),
        handleDoubleClick: () => addLog('Double Click'),
        handleMouseDown: () => addLog('Mouse Down'),
        handleMouseUp: () => addLog('Mouse Up'),
        handleMouseOver: () => addLog('Mouse Over'),
        handleMouseOut: () => addLog('Mouse Out'),
        handleMouseMove: (e) => {
            setMousePos({ x: e.offsetX, y: e.offsetY });
            addLog('Mouse Move', `x:${e.offsetX}, y:${e.offsetY}`);
        },
        handleMouseEnter: () => addLog('Mouse Enter'),
        handleMouseLeave: () => addLog('Mouse Leave'),

        // Form Events
        handleChange: (e) => {
            setInputValue(e.target.value);
            addLog('Change', e.target.value);
        },
        handleInput: (e) => addLog('Input', e.target.value),
        handleFocus: (e) => {
            setFocusState('focused');
            addLog('Focus', e.target.tagName);
        },
        handleBlur: (e) => {
            setFocusState('blurred');
            addLog('Blur', e.target.tagName);
        },
        handleSubmit: (e) => {
            e.preventDefault();
            addLog('Form Submit', inputValue);
        },
        handleReset: () => {
            setInputValue('');
            addLog('Form Reset');
        },

        // Keyboard Events
        handleKeyDown: (e) => {
            setKeyPressed(e.key);
            addLog('Key Down', e.key);
        },
        handleKeyUp: (e) => {
            setKeyPressed('');
            addLog('Key Up', e.key);
        },
        handleKeyPress: (e) => addLog('Key Press', e.key),

        // Touch Events (for mobile)
        handleTouchStart: () => addLog('Touch Start'),
        handleTouchEnd: () => addLog('Touch End'),
        handleTouchMove: () => addLog('Touch Move'),

        // Drag Events
        handleDragStart: (e) => {
            e.dataTransfer.setData('text/plain', dragText);
            addLog('Drag Start');
        },
        handleDrag: () => addLog('Dragging'),
        handleDragOver: (e) => {
            e.preventDefault();
            addLog('Drag Over');
        },
        handleDrop: (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            setDragText(data + ' (dropped!)');
            addLog('Drop', data);
        },
        handleDragEnd: () => addLog('Drag End'),

        // Context Menu
        handleContextMenu: (e) => {
            e.preventDefault();
            addLog('Context Menu (Right Click)');
        },

        // Wheel Event
        handleWheel: (e) => {
            addLog('Mouse Wheel', e.deltaY > 0 ? 'Down' : 'Up');
        },

        // Clear logs
        clearLogs: () => setLogs([])
    });

    return html`
        <style>
            .events-demo {
                padding: 20px;
                border: 2px solid #3498db;
                border-radius: 10px;
                font-family: 'Monaco', 'Courier New', monospace;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            }

            .demo-section {
                margin-bottom: 20px;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border-left: 4px solid #3498db;
            }

            .demo-section h4 {
                margin: 0 0 10px 0;
                color: #2c3e50;
            }

            .event-area {
                padding: 20px;
                margin: 10px 0;
                border: 2px dashed #bdc3c7;
                border-radius: 5px;
                background: #ecf0f1;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .event-area:hover {
                background: #d5dbdb;
                border-color: #3498db;
            }

            .mouse-tracker {
                position: relative;
                height: 100px;
                background: linear-gradient(45deg, #e74c3c, #f39c12);
                border-radius: 5px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: crosshair;
            }

            .draggable {
                padding: 15px;
                background: #2ecc71;
                color: white;
                border-radius: 5px;
                cursor: move;
                display: inline-block;
                margin: 10px;
            }

            .drop-zone {
                min-height: 80px;
                border: 3px dashed #95a5a6;
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ecf0f1;
                transition: all 0.3s ease;
            }

            .drop-zone:hover,
            .drop-zone.dragover {
                border-color: #2ecc71;
                background: #d5f4e6;
            }

            .form-controls {
                display: flex;
                gap: 10px;
                margin: 10px 0;
                flex-wrap: wrap;
            }

            .form-controls input,
            .form-controls button,
            .form-controls select {
                padding: 8px 12px;
                border: 2px solid #bdc3c7;
                border-radius: 4px;
                font-size: 14px;
            }

            .form-controls button {
                background: #3498db;
                color: white;
                border-color: #3498db;
                cursor: pointer;
            }

            .form-controls button:hover {
                background: #2980b9;
            }

            .logs {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 15px;
                border-radius: 5px;
                font-family: 'Monaco', monospace;
                font-size: 12px;
                max-height: 300px;
                overflow-y: auto;
                margin-top: 15px;
            }

            .log-entry {
                margin: 2px 0;
                padding: 2px 0;
            }

            .status {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: bold;
            }

            .status.focused {
                background: #2ecc71;
                color: white;
            }

            .status.blurred {
                background: #95a5a6;
                color: white;
            }

            .key-display {
                background: #34495e;
                color: white;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                font-weight: bold;
                min-height: 20px;
                margin: 10px 0;
            }
        </style>

        <div class="events-demo">
            <h3>🎯 Comprehensive Events Demo</h3>
            <p>This component demonstrates all supported event types in Glint.</p>

            <div class="demo-section">
                <h4>🖱️ Mouse Events</h4>
                <div class="mouse-tracker" 
                     onclick="handleClick"
                     ondblclick="handleDoubleClick"
                     onmousedown="handleMouseDown"
                     onmouseup="handleMouseUp"
                     onmouseover="handleMouseOver"
                     onmouseout="handleMouseOut"
                     onmousemove="handleMouseMove"
                     onmouseenter="handleMouseEnter"
                     onmouseleave="handleMouseLeave"
                     oncontextmenu="handleContextMenu"
                     onwheel="handleWheel">
                    Mouse Position: (${mousePos.x}, ${mousePos.y})
                    <br><small>Try: click, double-click, move, right-click, scroll</small>
                </div>
            </div>

            <div class="demo-section">
                <h4>📝 Form Events</h4>
                <form onsubmit="handleSubmit" onreset="handleReset">
                    <div class="form-controls">
                        <input type="text" 
                               value="${inputValue}" 
                               placeholder="Type something..."
                               onchange="handleChange"
                               oninput="handleInput"
                               onfocus="handleFocus"
                               onblur="handleBlur" />
                        <button type="submit">Submit</button>
                        <button type="reset">Reset</button>
                        <span class="status ${focusState}">${focusState || 'neutral'}</span>
                    </div>
                </form>
            </div>

            <div class="demo-section">
                <h4>⌨️ Keyboard Events</h4>
                <input type="text" 
                       placeholder="Press keys here..."
                       onkeydown="handleKeyDown"
                       onkeyup="handleKeyUp"
                       onkeypress="handleKeyPress" />
                <div class="key-display">
                    ${keyPressed ? 'Key Pressed: ' + keyPressed : 'Press any key...'}
                </div>
            </div>

            <div class="demo-section">
                <h4>📱 Touch Events (Mobile)</h4>
                <div class="event-area"
                     ontouchstart="handleTouchStart"
                     ontouchend="handleTouchEnd"
                     ontouchmove="handleTouchMove">
                    Touch this area (mobile devices)
                </div>
            </div>

            <div class="demo-section">
                <h4>🔄 Drag & Drop Events</h4>
                <div draggable="true" 
                     class="draggable"
                     ondragstart="handleDragStart"
                     ondrag="handleDrag"
                     ondragend="handleDragEnd">
                    ${dragText}
                </div>
                <div class="drop-zone"
                     ondragover="handleDragOver"
                     ondrop="handleDrop">
                    Drop zone - drag the item above here
                </div>
            </div>

            <div class="demo-section">
                <h4>📊 Event Logs</h4>
                <button onclick="clearLogs">Clear Logs</button>
                <div class="logs">
                    ${logs.map(log => '<div class="log-entry">' + log + '</div>').join('')}
                    ${logs.length === 0 ? '<div class="log-entry">No events logged yet...</div>' : ''}
                </div>
            </div>
        </div>
    `;
}
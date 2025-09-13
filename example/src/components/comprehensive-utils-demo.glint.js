function ComprehensiveUtilsDemo() {
    const [text, setText] = useState('Hello World This is a Test');
    const [color, setColor] = useState('#3498db');
    const [testDate] = useState(new Date(2024, 8, 1)); // Sept 1, 2024
    const [mathA, setMathA] = useState(5);
    const [mathB, setMathB] = useState(3);

    useHandlers({
        updateText: (e) => setText(e.target.value),
        updateColor: (e) => setColor(e.target.value),
        updateMathA: (e) => setMathA(parseInt(e.target.value) || 0),
        updateMathB: (e) => setMathB(parseInt(e.target.value) || 0),
        randomizeAll: () => {
            setText(randomWords());
            setColor(randomHexColor());
            setMathA(randomBetween(1, 20));
            setMathB(randomBetween(1, 20));
        }
    });

    // Helper functions using our utilities
    const randomWords = () => {
        const words = ['Amazing', 'Fantastic', 'Incredible', 'Wonderful', 'Brilliant', 'Awesome'];
        const count = randomBetween(2, 4);
        const selected = [];
        for (let i = 0; i < count; i++) {
            selected.push(words[randomBetween(0, words.length - 1)]);
        }
        return selected.join(' ');
    };

    const randomHexColor = () => {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#34495e'];
        return colors[randomBetween(0, colors.length - 1)];
    };

    // Get color RGB values
    const rgb = hexToRgb(color);
    const rgbString = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'Invalid';

    return html`
        <style>
            .comprehensive-demo {
                padding: 25px;
                border: 2px solid ${color};
                border-radius: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, ${color}22, ${color}11);
            }
            
            .demo-section {
                margin-bottom: 25px;
                padding: 15px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .demo-section h4 {
                margin: 0 0 15px 0;
                color: ${color};
                border-bottom: 2px solid ${color};
                padding-bottom: 8px;
            }
            
            .controls {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .controls label {
                display: flex;
                flex-direction: column;
                gap: 5px;
                min-width: 120px;
            }
            
            .controls input {
                padding: 8px;
                border: 2px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .controls input:focus {
                border-color: ${color};
                outline: none;
            }
            
            .result-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 15px;
            }
            
            .result-item {
                padding: 10px;
                background: ${color}11;
                border: 1px solid ${color}44;
                border-radius: 6px;
            }
            
            .result-item strong {
                color: ${color};
            }
            
            .main-button {
                background: ${color};
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            
            .main-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px ${color}44;
            }
            
            .color-preview {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: ${color};
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
        </style>
        
        <div class="comprehensive-demo">
            <h3>🛠️ Comprehensive Utilities Demo</h3>
            <p>This demonstrates how multiple utility files work together in Glint components.</p>
            
            <div class="controls">
                <button class="main-button" onclick="randomizeAll">🎲 Randomize Everything</button>
            </div>
            
            <div class="demo-section">
                <h4>📝 String Utilities (StringUtils)</h4>
                <div class="controls">
                    <label>
                        Text Input:
                        <input type="text" value="${text}" onchange="updateText" />
                    </label>
                </div>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Original:</strong><br>
                        "${text}"
                    </div>
                    <div class="result-item">
                        <strong>Capitalized:</strong><br>
                        "${StringUtils.capitalize(text.toLowerCase())}"
                    </div>
                    <div class="result-item">
                        <strong>Camel Case:</strong><br>
                        "${StringUtils.toCamelCase(text)}"
                    </div>
                    <div class="result-item">
                        <strong>Kebab Case:</strong><br>
                        "${StringUtils.toKebabCase(text)}"
                    </div>
                    <div class="result-item">
                        <strong>Truncated:</strong><br>
                        "${StringUtils.truncate(text, 15)}"
                    </div>
                    <div class="result-item">
                        <strong>Word Count:</strong><br>
                        ${StringUtils.wordCount(text)} words
                    </div>
                </div>
            </div>
            
            <div class="demo-section">
                <h4>🎨 Color Utilities (Individual Functions)</h4>
                <div class="controls">
                    <label>
                        Color:
                        <input type="color" value="${color}" onchange="updateColor" />
                    </label>
                    <div class="color-preview"></div>
                </div>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Hex:</strong><br>
                        ${color}
                    </div>
                    <div class="result-item">
                        <strong>RGB:</strong><br>
                        ${rgbString}
                    </div>
                    <div class="result-item">
                        <strong>RGB Object:</strong><br>
                        ${rgb ? `r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}` : 'Invalid'}
                    </div>
                    <div class="result-item">
                        <strong>Back to Hex:</strong><br>
                        ${rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : 'N/A'}
                    </div>
                </div>
            </div>
            
            <div class="demo-section">
                <h4>📅 Date Utilities (DateUtils)</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Test Date:</strong><br>
                        ${DateUtils.formatDate(testDate)}
                    </div>
                    <div class="result-item">
                        <strong>Time Ago:</strong><br>
                        ${DateUtils.timeAgo(testDate)}
                    </div>
                    <div class="result-item">
                        <strong>+30 Days:</strong><br>
                        ${DateUtils.formatDate(DateUtils.addDays(testDate, 30))}
                    </div>
                    <div class="result-item">
                        <strong>Current Date:</strong><br>
                        ${DateUtils.formatDate(new Date())}
                    </div>
                </div>
            </div>
            
            <div class="demo-section">
                <h4>🔢 Math Utilities (MathUtils)</h4>
                <div class="controls">
                    <label>
                        Number A:
                        <input type="number" value="${mathA}" onchange="updateMathA" />
                    </label>
                    <label>
                        Number B:
                        <input type="number" value="${mathB}" onchange="updateMathB" />
                    </label>
                </div>
                <div class="result-grid">
                    <div class="result-item">
                        <strong>Add:</strong><br>
                        ${MathUtils.formatNumber(MathUtils.add(mathA, mathB))}
                    </div>
                    <div class="result-item">
                        <strong>Multiply:</strong><br>
                        ${MathUtils.formatNumber(MathUtils.multiply(mathA, mathB))}
                    </div>
                    <div class="result-item">
                        <strong>Square A:</strong><br>
                        ${MathUtils.formatNumber(MathUtils.square(mathA))}
                    </div>
                    <div class="result-item">
                        <strong>Factorial A:</strong><br>
                        ${mathA <= 10 ? MathUtils.formatNumber(MathUtils.factorial(mathA)) : 'Too large!'}
                    </div>
                    <div class="result-item">
                        <strong>Random (1-100):</strong><br>
                        ${MathUtils.formatNumber(randomBetween(1, 100))}
                    </div>
                    <div class="result-item">
                        <strong>Currency Format:</strong><br>
                        ${formatCurrency(MathUtils.multiply(mathA, mathB))}
                    </div>
                </div>
            </div>
        </div>
    `;
}
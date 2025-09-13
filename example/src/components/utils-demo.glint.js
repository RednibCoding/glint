function UtilsDemo() {
    const [a, setA] = useState(5);
    const [b, setB] = useState(3);
    const [result, setResult] = useState(0);
    const [operation, setOperation] = useState('add');

    const performCalculation = () => {
        let newResult;
        switch (operation) {
            case 'add':
                newResult = MathUtils.add(a, b);
                break;
            case 'multiply':
                newResult = MathUtils.multiply(a, b);
                break;
            case 'square':
                newResult = MathUtils.square(a);
                break;
            case 'factorial':
                newResult = MathUtils.factorial(a);
                break;
            default:
                newResult = 0;
        }
        setResult(newResult);
    };

    const randomizeValues = () => {
        setA(randomBetween(1, 10));
        setB(randomBetween(1, 10));
    };

    useHandlers({
        performCalculation,
        randomizeValues,
        updateA: (e) => setA(parseInt(e.target.value) || 0),
        updateB: (e) => setB(parseInt(e.target.value) || 0),
        updateOperation: (e) => setOperation(e.target.value)
    });

    return html`
        <style>
            .utils-demo {
                padding: 20px;
                border: 2px solid #007acc;
                border-radius: 10px;
                font-family: Arial, sans-serif;
            }
            
            .controls {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                align-items: center;
            }
            
            .result {
                font-size: 1.5rem;
                font-weight: bold;
                color: #007acc;
                margin: 15px 0;
            }
            
            input, select, button {
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
            }
            
            button {
                background: #007acc;
                color: white;
                border: none;
                cursor: pointer;
            }
            
            button:hover {
                background: #005a9e;
            }
        </style>
        
        <div class="utils-demo">
            <h3>Math Utils Demo - Using Utility Functions</h3>
            
            <div class="controls">
                <label>A: <input type="number" value="${a}" onchange="updateA" /></label>
                <label>B: <input type="number" value="${b}" onchange="updateB" /></label>
                <select onchange="updateOperation" value="${operation}">
                    <option value="add">Add</option>
                    <option value="multiply">Multiply</option>
                    <option value="square">Square A</option>
                    <option value="factorial">Factorial A</option>
                </select>
            </div>
            
            <div class="controls">
                <button onclick="performCalculation">Calculate</button>
                <button onclick="randomizeValues">Random Values</button>
            </div>
            
            <div class="result">
                Result: ${MathUtils.formatNumber(result)}
            </div>
        </div>
    `;
}
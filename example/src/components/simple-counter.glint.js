// Clean Function Component
function SimpleCounter() {
    const [count, setCount] = useState(0);
    
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
    
    // Register handlers right after defining them
    useHandlers({ increment, decrement, reset });
    
    return html`
        <style>
            .counter {
                text-align: center;
                padding: 2rem;
                font-family: Arial, sans-serif;
            }
            
            .count-display {
                font-size: 3rem;
                font-weight: bold;
                color: #333;
                margin: 1rem 0;
            }
            
            .buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            button {
                padding: 0.75rem 1.5rem;
                font-size: 1rem;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .btn-increment {
                background-color: #10b981;
                color: white;
            }
            
            .btn-increment:hover {
                background-color: #059669;
            }
            
            .btn-decrement {
                background-color: #ef4444;
                color: white;
            }
            
            .btn-decrement:hover {
                background-color: #dc2626;
            }
            
            .btn-reset {
                background-color: #6b7280;
                color: white;
            }
            
            .btn-reset:hover {
                background-color: #4b5563;
            }
        </style>
        
        <div class="counter">
            <h2>Clean Counter</h2>
            <div class="count-display">${count}</div>
            <div class="buttons">
                <button class="btn-increment" onclick="increment">+</button>
                <button class="btn-decrement" onclick="decrement">-</button>
                <button class="btn-reset" onclick="reset">Reset</button>
            </div>
        </div>
    `;
}
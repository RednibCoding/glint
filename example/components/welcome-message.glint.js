function WelcomeMessage(props) {
    const jsx = `
        <style>
            .welcome {
                padding: 20px;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                background: linear-gradient(135deg, #f0f8f0, #e8f5e8);
                font-family: Arial, sans-serif;
            }
            .name {
                color: #2E7D32;
                font-weight: bold;
                font-size: 1.2em;
            }
            .age {
                color: #666;
                font-style: italic;
            }
        </style>
        <div class="welcome">
            <h2>Welcome, <span class="name">${props.name || 'Anonymous'}</span>!</h2>
            ${props.age ? `<p class="age">Age: ${props.age}</p>` : ''}
            <p>Thanks for trying Glint v2.0!</p>
        </div>
    `;
    
    return jsx;
}
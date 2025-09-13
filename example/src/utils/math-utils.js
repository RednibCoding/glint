// Math utility functions
const MathUtils = {
    add: (a, b) => a + b,
    multiply: (a, b) => a * b,
    square: (n) => n * n,
    factorial: (n) => {
        if (n <= 1) return 1;
        return n * MathUtils.factorial(n - 1);
    },
    formatNumber: (num) => {
        return new Intl.NumberFormat().format(num);
    }
};

// Also export individual functions for convenience
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}
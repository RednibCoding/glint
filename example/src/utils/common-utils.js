// String utility functions
const StringUtils = {
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    
    toCamelCase: (str) => {
        return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    },
    
    toKebabCase: (str) => {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    },
    
    truncate: (str, length = 50) => {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },
    
    wordCount: (str) => {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
};

// Date utilities
const DateUtils = {
    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    timeAgo: (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    },
    
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
};

// Color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}
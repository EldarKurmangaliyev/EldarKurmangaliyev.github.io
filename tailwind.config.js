/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './app.js', './languages.js'],
    theme: {
        extend: {
            colors: {
                sage: '#7c9a8c',
                'sage-light': '#a8c4b8',
                'sage-dark': '#5c7a6c',
                'sage-pale': '#f0f5f2',
                stone: '#f5f3ef',
                warm: '#c9b896',
                cream: '#f5f0e6',
                'cream-dark': '#e8e0d0',
                sand: '#d4c9b5',
                gold: '#c9a86c',
                yellow: { 500: '#d4a84c', 600: '#b8953c' },
            },
        },
    },
    plugins: [],
};

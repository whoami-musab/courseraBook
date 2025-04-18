// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,js}', // Adjust to match your file locations
        './views/**/*.ejs',     // Add any template engines you're using
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

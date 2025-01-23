/** @type {import('tailwindcss').Config} */
export default {
    content: ['./public/**', './src/**/*.{vue,js,ts,jsx,tsx}', './formkit.theme.ts'],
    theme: {
        extend: {
            colors: {}
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio')
    ],
}


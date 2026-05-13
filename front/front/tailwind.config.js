/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // active le mode sombre basé sur une classe
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}" // tous tes fichiers React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

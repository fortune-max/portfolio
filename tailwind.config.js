/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#50d71e',
      },
      fontFamily: {
        maven: ['Maven Pro', 'sans-serif'],
        sans: ['Source Code Pro', 'sans-serif'],
        kurale: ['Kurale', 'serif'],
      },
    },
  },
  plugins: [],
}


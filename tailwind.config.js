/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './src/**/*.{vue,js,ts,jsx,tsx,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#d6e0fd',
          300: '#b3c5fb',
          400: '#8aa3f8',
          500: '#6a82f5',
          600: '#4a5eeb',
          700: '#3a4ad8',
          800: '#343eaf',
          900: '#2f388c',
          950: '#1e2252',
        },
        pokemon: {
          red: '#e20000',
          yellow: '#ffbf0b',
          blue: '#0075BE',
          yellow2: '#FFCC00',
        },
      },
      boxShadow: {
        card: '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}
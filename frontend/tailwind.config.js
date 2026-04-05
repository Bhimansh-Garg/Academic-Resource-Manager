/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#003366', // Primary navy
        },
        gold: {
          DEFAULT: '#FFD700', // Accent
        },
        gray: {
          100: '#F0F0F0', // Cards bg
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Open Sans', 'sans-serif'],
        serif: ['Georgia', 'Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}

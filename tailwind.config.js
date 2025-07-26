/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B7FF5",
        secondary: "#F5A6C9",
        accent: "#FFB84D",
        surface: "#FFFFFF",
        background: "#FAF7FF",
        success: "#68D391",
        warning: "#F6AD55",
        error: "#FC8181",
        info: "#63B3ED"
      },
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'flame': 'flame 1.5s ease-in-out infinite alternate',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite'
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(1) rotate(-1deg)' },
          '100%': { transform: 'scale(1.1) rotate(1deg)' }
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      }
    },
  },
  plugins: [],
}
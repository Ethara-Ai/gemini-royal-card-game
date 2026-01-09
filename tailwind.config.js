/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        casino: {
          green: '#0f5132',
          darkGreen: '#0b3d26',
          gold: '#ffd700',
          blue: '#1e3a8a',
          darkBlue: '#172554',
          red: '#dc2626',
          black: '#171717',
          felt: '#35654d', // Typical felt color
        }
      },
      animation: {
        'deal': 'deal 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-up': 'scaleUp 0.2s ease-out forwards',
      },
      keyframes: {
        deal: {
          '0%': { transform: 'translateY(-100vh) scale(0.5)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}


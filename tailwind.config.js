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
        brand: {
          dark: '#0B0B0B',
          surface: '#121214',
          card: '#18181B',
          border: '#2A2A2E',
          red: '#E11D2E',
          flame: '#FF7A1A',
          amber: '#FF9F1C',
          cream: '#F5EBDD',
          muted: '#A19D94',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Anton', 'Impact', 'sans-serif'],
        heading: ['"Oswald"', 'sans-serif'],
        sans: ['"Poppins"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'flame-sm': '0 0 15px -3px rgba(225, 29, 46, 0.3)',
        'flame': '0 0 25px -2px rgba(225, 29, 46, 0.45)',
        'flame-lg': '0 0 35px -1px rgba(255, 122, 26, 0.5)',
        'flame-glow': '0 0 50px rgba(225, 29, 46, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flame-flicker': 'flicker 3s infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}

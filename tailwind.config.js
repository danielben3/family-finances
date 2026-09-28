/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Frank Ruhl Libre"', 'serif'],
        sans: ['Inter', 'Heebo', 'Rubik', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canvas: '#FAF8F5',
        ink: {
          DEFAULT: '#1A1A1A',
          primary: '#1A1A1A',
          secondary: '#737373',
          muted: '#A3A3A3',
        },
        editorial: {
          bg: '#FAF8F5',
          surface: '#FFFFFF',
          border: '#EAE6DF',
          muted: '#737373',
          dark: '#1A1A1A',
        },
        poker: {
          gold: '#F59E0B',
          emerald: '#10B981',
          cobalt: '#2563EB',
          black: '#1A1A1A',
          crimson: '#EF4444',
          indigo: '#4F46E5',
        },
        porcelain: '#FAF8F5',
        deepNavy: '#1A1A1A',
        emeraldGlow: '#10B981',
        slateGold: '#F59E0B',
        fin: {
          bg: '#FAF8F5',
          surface: '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.98)',
          border: '#EAE6DF',
          emerald: '#10B981',
          rose: '#EF4444',
          sky: '#0284c7',
          amber: '#F59E0B',
          purple: '#7c3aed',
          blue: '#2563EB'
        }
      }
    },
  },
  plugins: [],
}

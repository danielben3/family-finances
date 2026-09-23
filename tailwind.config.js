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
        sans: ['Rubik', 'Heebo', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        porcelain: '#F8FAFC',
        deepNavy: '#0F172A',
        emeraldGlow: '#059669',
        slateGold: '#C5A869',
        fin: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: 'rgba(255, 255, 255, 0.92)',
          border: 'rgba(226, 232, 240, 0.85)',
          emerald: '#006c4a',
          rose: '#ba1a1a',
          sky: '#0284c7',
          amber: '#d97706',
          purple: '#7c3aed',
          blue: '#2563EB'
        }
      }
    },
  },
  plugins: [],
}

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
        sans: ['Heebo', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        fin: {
          bg: '#070A12',
          surface: '#0F172A',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          emerald: '#10B981',
          rose: '#EF4444',
          sky: '#38BDF8',
          amber: '#F59E0B',
          purple: '#A855F7',
          blue: '#3B82F6'
        }
      }
    },
  },
  plugins: [],
}

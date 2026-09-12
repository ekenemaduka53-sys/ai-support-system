/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-jakarta)', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['var(--font-mono)', '"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#F4F7FB',
          100: '#E8EFF7',
          200: '#C7D9EC',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          900: '#0F172A',
        },
      },
    },
  },
  plugins: [],
}


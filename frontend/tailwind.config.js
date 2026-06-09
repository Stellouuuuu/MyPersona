/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        persona: {
          50: '#f3f0ff',
          100: '#e8e2ff',
          200: '#d4c9ff',
          300: '#b5a3ff',
          400: '#9478ff',
          500: '#7c5cfc',
          600: '#6c44f5',
          700: '#5c33e0',
          800: '#4c2ab8',
          900: '#3f2596',
          950: '#261563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 32px rgba(60, 40, 140, 0.08)',
        float: '0 20px 60px rgba(60, 40, 140, 0.12)',
      },
    },
  },
  plugins: [],
};

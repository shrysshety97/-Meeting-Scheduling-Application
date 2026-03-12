/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        climatiq: {
          purple: '#312e81',
          indigo: '#4338ca',
          orange: '#f97316',
        }
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        scaleIn: 'scaleIn 0.4s ease-out',
      }
    }
  },
  plugins: []
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#070809',
          900: '#0b0c0e',
          850: '#111317',
          800: '#16191f',
          700: '#1e222b',
          600: '#2a2f3b',
        },
        warm: {
          copper: '#d48c5c',
          amber: '#e59a68',
          deep: '#b87342',
          glow: 'rgba(212, 140, 92, 0.15)',
        },
        offwhite: {
          DEFAULT: '#f5f2eb',
          muted: '#e6e1d5',
          dim: '#c2bdb2',
        },
        muted: {
          grey: '#9498a1',
          dark: '#5a5f69',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'copper': '0 4px 20px -2px rgba(212, 140, 92, 0.18)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(212, 140, 92, 0.08) 0%, rgba(11, 12, 14, 0) 70%)',
        'copper-gradient': 'linear-gradient(135deg, #d48c5c 0%, #b87342 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    }
  },
  plugins: [],
}

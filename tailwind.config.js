/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Backgrounds - Light Theme
        charcoal: {
          DEFAULT: '#FFFFFF',
          light: '#F8F9FA',
          dark: '#FFFFFF',
          medium: '#F0F2F5',
        },
        surface: {
          DEFAULT: '#FAFAFA',
          light: '#F5F5F5',
          elevated: '#FFFFFF',
        },
        // Primary Accent - Premium Gold
        gold: {
          DEFAULT: '#C9A962',
          light: '#D4B978',
          dark: '#B8944D',
          muted: '#A08A4E',
          warm: '#D4AF37',
          bright: '#FFD700',
          pale: '#E8D5A3',
        },
        // Legacy teal mapping to gold for compatibility
        teal: {
          DEFAULT: '#C9A962',
          light: '#D4B978',
          dark: '#B8944D',
        },
        // Text Colors - Dark for Light Theme
        ivory: {
          DEFAULT: '#1a1a1a',
          muted: '#333333',
        },
        // Glass Effects - Light Theme
        'glass-white': 'rgba(255, 255, 255, 0.7)',
        'glass-border': 'rgba(0, 0, 0, 0.08)',
        'glass-gold': 'rgba(201, 169, 98, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Sora', 'Inter', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        '3d': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'float': '0 30px 60px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 40px rgba(201, 169, 98, 0.3)',
        'glow-intense': '0 0 80px rgba(201, 169, 98, 0.4)',
        'gold': '0 4px 20px rgba(201, 169, 98, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Backgrounds - Blue-led Light Theme
        charcoal: {
          DEFAULT: '#F8FAFC',
          light: '#F1F5F9',
          dark: '#0F2A44',
          medium: '#E2E8F0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
          elevated: '#FFFFFF',
        },
        // Primary Accent - Orange
        gold: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
          muted: '#C2410C',
          warm: '#1B2A4A',
          bright: '#2563EB',
          pale: '#FFF7ED',
        },
        // Legacy teal mapping to blue for compatibility
        teal: {
          DEFAULT: '#1B2A4A',
          light: '#2563EB',
          dark: '#0F2A44',
        },
        // Text Colors - Dark for Light Theme
        ivory: {
          DEFAULT: '#0F172A',
          muted: '#334155',
        },
        // Glass Effects - Light Theme
        'glass-white': 'rgba(255, 255, 255, 0.7)',
        'glass-border': 'rgba(0, 0, 0, 0.08)',
        'glass-gold': 'rgba(249, 115, 22, 0.1)',
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
        'glow': '0 0 40px rgba(249, 115, 22, 0.3)',
        'glow-intense': '0 0 80px rgba(249, 115, 22, 0.4)',
        'gold': '0 4px 20px rgba(249, 115, 22, 0.25)',
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
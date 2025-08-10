/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome palette remapping
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Keep using `purple-*` utility classes but map them to grays
        purple: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0a0a0a',
        },
        cosmic: {
          purple: '#71717a',
          'purple-light': '#a1a1aa',
          'purple-dark': '#3f3f46',
          black: '#000000',
          'black-light': '#0a0a0a',
          gray: '#1a1a1a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-cosmic': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite -2s',
        'float-slow': 'float 10s ease-in-out infinite -4s',
        'shimmer': 'shimmer 3s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
          },
          '33%': { 
            transform: 'translateY(-30px) rotate(120deg)',
          },
          '66%': { 
            transform: 'translateY(-15px) rotate(240deg)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(162, 89, 255, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(162, 89, 255, 0.6)',
          },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(162, 89, 255, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(162, 89, 255, 0.6)',
          },
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(circle at 50% 50%, #a3a3a3 0%, rgba(163,163,163,0.25) 20%, rgba(163,163,163,0.1) 40%, transparent 60%)',
        'cosmic-gradient-2': 'radial-gradient(circle at 80% 20%, #a3a3a3 0%, rgba(163,163,163,0.25) 10%, rgba(163,163,163,0.1) 20%, transparent 40%)',
        'cosmic-gradient-3': 'radial-gradient(circle at 20% 80%, #a3a3a3 0%, rgba(163,163,163,0.25) 10%, rgba(163,163,163,0.1) 20%, transparent 40%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'cosmic-bg': 'radial-gradient(circle at 20% 80%, rgba(163, 163, 163, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(163, 163, 163, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(163, 163, 163, 0.05) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
        'parallax-gradient': 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(162,89,255,0.1) 50%, rgba(0,0,0,0.9) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      boxShadow: {
        'cosmic': '0 0 30px rgba(162, 89, 255, 0.4)',
        'cosmic-lg': '0 0 50px rgba(162, 89, 255, 0.6)',
        'cosmic-xl': '0 0 80px rgba(162, 89, 255, 0.8)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(162, 89, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-strong': '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(162, 89, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        'inner-glow': 'inset 0 0 20px rgba(162, 89, 255, 0.1)',
      },
      fontFamily: {
        'cosmic': ['Montserrat', 'Roboto', 'DIN Next Pro', 'Arial', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
      },
      blur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 
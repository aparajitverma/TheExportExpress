/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#a259ff',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a259ff',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        cosmic: {
          purple: '#a259ff',
          'purple-light': '#c084fc',
          'purple-dark': '#7e22ce',
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
        'cosmic-gradient': 'radial-gradient(circle at 50% 50%, #a259ff 0%, rgba(162,89,255,0.3) 20%, rgba(162,89,255,0.1) 40%, transparent 60%)',
        'cosmic-gradient-2': 'radial-gradient(circle at 80% 20%, #a259ff 0%, rgba(162,89,255,0.3) 10%, rgba(162,89,255,0.1) 20%, transparent 40%)',
        'cosmic-gradient-3': 'radial-gradient(circle at 20% 80%, #a259ff 0%, rgba(162,89,255,0.3) 10%, rgba(162,89,255,0.1) 20%, transparent 40%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'cosmic-bg': 'radial-gradient(circle at 20% 80%, rgba(162, 89, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(162, 89, 255, 0.05) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
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
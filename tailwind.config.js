/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        // Primary palette
        sage: {
          50:  '#f4f7f5',
          100: '#e6ece8',
          200: '#cdd9d1',
          300: '#a8bfae',
          400: '#7da088',
          500: '#5c846a',
          600: '#476a54',
          700: '#3a5644',
          800: '#2D4A3E',
          900: '#283b32',
          950: '#141f1a',
        },
        gold: {
          50:  '#fdf9f0',
          100: '#f9efda',
          200: '#f2ddb4',
          300: '#e9c485',
          400: '#dfA855',
          500: '#C8A96E',
          600: '#b8923a',
          700: '#9a7531',
          800: '#7d5e2d',
          900: '#674d28',
          950: '#392814',
        },
        ivory: {
          50:  '#FFFEFB',
          100: '#FAF8F5',
          200: '#F5F0EA',
          300: '#EBE4DA',
          400: '#DDD2C4',
          500: '#C8B9A8',
        },
        rose: {
          50:  '#fdf5f5',
          100: '#fae8e8',
          200: '#f5d4d4',
          300: '#edb5b5',
          400: '#D4A0A0',
          500: '#c07878',
          600: '#a85d5d',
          700: '#8c4c4c',
          800: '#754242',
          900: '#633c3c',
        },
      },
      animation: {
        'fade-up':     'fadeUp 0.7s ease forwards',
        'fade-in':     'fadeIn 0.6s ease forwards',
        'slide-up':    'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down':  'slideDown 0.3s ease forwards',
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'float 8s ease-in-out infinite',
        'float-delay': 'float 7s ease-in-out 2s infinite',
        'spin-slow':   'spin 25s linear infinite',
        'shimmer':     'shimmer 3s ease-in-out infinite',
        'pulse-soft':  'pulseSoft 4s ease-in-out infinite',
        'morph':       'morph 10s ease-in-out infinite',
        'marquee':     'marquee 30s linear infinite',
        'counter':     'counter 2s ease-out forwards',
        'draw-line':   'drawLine 1.5s ease forwards',
        'scale-in':    'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':      { opacity: '0.8', transform: 'scale(1.05)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%':      { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        drawLine: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

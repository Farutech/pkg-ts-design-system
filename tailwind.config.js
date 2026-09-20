/**
 * ============================================================================
 *  Tailwind — mapeo 1:1 con los tokens canónicos (--ft-*)
 * ============================================================================
 *  Ninguna utilidad tiene colores "quemados": `bg-primary-600`, `text-danger`,
 *  `rounded-ft-lg`, etc. siguen a los tokens, por lo que tematizar el Design
 *  System (o cambiar de modo claro/oscuro) actualiza también las utilidades.
 *
 *  darkMode: acepta la clase `.dark` Y el atributo `[data-theme="dark"]`
 *  (el que emite <DesignSystemProvider colorMode="dark" />).
 * ============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* Paleta primitiva como canales RGB -> soporta `bg-primary-600/30` */
        primary: {
          50: 'rgb(var(--ft-primary-50) / <alpha-value>)',
          100: 'rgb(var(--ft-primary-100) / <alpha-value>)',
          200: 'rgb(var(--ft-primary-200) / <alpha-value>)',
          300: 'rgb(var(--ft-primary-300) / <alpha-value>)',
          400: 'rgb(var(--ft-primary-400) / <alpha-value>)',
          500: 'rgb(var(--ft-primary-500) / <alpha-value>)',
          600: 'rgb(var(--ft-primary-600) / <alpha-value>)',
          700: 'rgb(var(--ft-primary-700) / <alpha-value>)',
          800: 'rgb(var(--ft-primary-800) / <alpha-value>)',
          900: 'rgb(var(--ft-primary-900) / <alpha-value>)',
          950: 'rgb(var(--ft-primary-950) / <alpha-value>)',
          DEFAULT: 'rgb(var(--ft-primary-600) / <alpha-value>)',
        },
        accent: 'var(--ft-color-accent)',
        spark: 'var(--ft-color-spark)',
        surface: {
          DEFAULT: 'var(--ft-color-surface)',
          hover: 'var(--ft-color-surface-hover)',
          raised: 'var(--ft-color-surface-raised)',
        },
        foreground: 'var(--ft-color-foreground)',
        muted: 'var(--ft-color-muted-foreground)',
        success: {
          DEFAULT: 'var(--ft-color-success)',
          soft: 'var(--ft-color-success-soft)',
        },
        warning: {
          DEFAULT: 'var(--ft-color-warning)',
          soft: 'var(--ft-color-warning-soft)',
        },
        danger: {
          DEFAULT: 'var(--ft-color-danger)',
          soft: 'var(--ft-color-danger-soft)',
        },
        info: {
          DEFAULT: 'var(--ft-color-info)',
          soft: 'var(--ft-color-info-soft)',
        },
      },
      fontFamily: {
        sans: 'var(--ft-font-sans)',
        mono: 'var(--ft-font-mono)',
      },
      borderRadius: {
        'ft-sm': 'var(--ft-radius-sm)',
        'ft-md': 'var(--ft-radius-md)',
        'ft-lg': 'var(--ft-radius-lg)',
        'ft-xl': 'var(--ft-radius-xl)',
        'ft-full': 'var(--ft-radius-full)',
      },
      boxShadow: {
        'ft-sm': 'var(--ft-shadow-sm)',
        ft: 'var(--ft-shadow-md)',
        'ft-lg': 'var(--ft-shadow-lg)',
        'ft-xl': 'var(--ft-shadow-xl)',
      },
      zIndex: {
        dropdown: 'var(--ft-z-dropdown)',
        sticky: 'var(--ft-z-sticky)',
        overlay: 'var(--ft-z-overlay)',
        modal: 'var(--ft-z-modal)',
        popover: 'var(--ft-z-popover)',
        toast: 'var(--ft-z-toast)',
        tooltip: 'var(--ft-z-tooltip)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        blob: 'blob 7s infinite',
        'flip-3d': 'flip3d 1.5s linear infinite',
        'flip-3d-invert': 'flip3dInvert 1.5s linear infinite',
        'flip-horizontal': 'flipHorizontal 1.5s linear infinite',
        'flip-horizontal-invert': 'flipHorizontalInvert 1.5s linear infinite',
        'spin-invert': 'spinInvert 1.5s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        flip3d: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        flip3dInvert: {
          '0%': { transform: 'rotateY(0deg)' },
          '49%': { transform: 'rotateY(180deg)' },
          '50%': { transform: 'rotateY(180deg) scaleX(-1)' },
          '100%': { transform: 'rotateY(360deg) scaleX(-1)' },
        },
        flipHorizontal: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(360deg)' },
        },
        flipHorizontalInvert: {
          '0%': { transform: 'rotateX(0deg)' },
          '49%': { transform: 'rotateX(180deg)' },
          '50%': { transform: 'rotateX(180deg) scaleY(-1)' },
          '100%': { transform: 'rotateX(360deg) scaleY(-1)' },
        },
        spinInvert: {
          '0%': { transform: 'rotate(0deg)', filter: 'invert(0)' },
          '50%': { transform: 'rotate(180deg)', filter: 'invert(1)' },
          '100%': { transform: 'rotate(360deg)', filter: 'invert(0)' },
        },
      },
    },
  },
  plugins: [
    /**
     * Utilidades 3D que Tailwind 3 no incluye y que usan los spinners del DS.
     */
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-500': { perspective: '500px' },
        '.perspective-1000': { perspective: '1000px' },
        '.perspective-1500': { perspective: '1500px' },
        '.transform-style-3d': { transformStyle: 'preserve-3d' },
        '.backface-hidden': { backfaceVisibility: 'hidden' },
      })
    },
  ],
}

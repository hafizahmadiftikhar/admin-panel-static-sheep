/** @type {import('tailwindcss').Config} */
import { colors, fontFamily, boxShadow, radii } from './src/theme.js';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      opacity: {
        8: '0.08',
      },
      borderOpacity: {
        8: '0.08',
      },
      colors: {
        // mapped 1:1 from the shared theme tokens (identical to /web)
        ink: colors.ink,
        'ink-2': colors.ink2,
        'ink-3': colors.ink3,
        gold: colors.gold,
        'gold-light': colors.goldLight,
        'gold-deep': colors.goldDeep,
      },
      fontFamily,
      borderRadius: {
        lg: radii.lg,
        xl: radii.xl,
      },
      boxShadow: {
        gold: boxShadow.gold,
        'gold-strong': boxShadow['gold-strong'],
      },
      backgroundImage: {
        'hero-fade':
          'linear-gradient(180deg, rgba(14,17,24,0.4) 0%, rgba(14,17,24,0.85) 70%, #0e1118 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

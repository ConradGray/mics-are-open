/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Rate card design language ──────────────────────────────
        // Remapping existing semantic names so all existing classes
        // auto-update without touching every JSX file.

        // "cream" → dark backgrounds
        cream: {
          50:  '#0A0A0B',   // page background — studio black
          100: '#141416',   // surface / raised panel
          200: '#26262A',   // borders / dividers
        },

        // "clay" → TMAO thumbnail red (was lime)
        clay: {
          50:  'rgba(228,37,43,0.08)',
          100: 'rgba(228,37,43,0.14)',
          200: 'rgba(228,37,43,0.24)',
          300: '#b81d22',
          400: '#cf2026',
          500: '#E4252B',   // PRIMARY accent — highlight red / number chip
          600: '#f03a40',   // hover
          700: '#ff5a5f',
        },

        // Thumbnail alternates
        tmao: {
          ink:    '#0A0A0B',
          panel:  '#141416',
          line:   '#26262A',
          red:    '#E4252B',
          yellow: '#FFD21F',
          purple: '#6A2C91',
        },

        // "ink" → off-white text scale
        ink: {
          400: '#7C7C84',   // very muted
          500: '#9A9AA2',   // muted / secondary text
          600: '#B9B9BF',   // secondary text
          700: '#D6D6DC',   // body copy
          800: '#FFFFFF',   // primary text
        },

        // "sage" → dark surface variants
        sage: {
          200: '#141416',
          400: '#1c1c20',
          600: '#26262A',
        },
      },

      fontFamily: {
        // Thumbnail design language: Montserrat everywhere
        // (900 all-caps for headlines, 600 wide-tracked for labels)
        display: ['Montserrat', '"Arial Black"', 'sans-serif'],
        sans: ['Montserrat', 'system-ui', 'Arial', 'sans-serif'],
      },

      boxShadow: {
        soft: '0 2px 12px -2px rgba(0,0,0,0.5)',
        card: '0 8px 32px -8px rgba(0,0,0,0.6)',
        lime: '0 8px 30px rgba(0,0,0,0.45)',   // name kept so existing classes still work
        chip: '0 8px 30px rgba(0,0,0,0.45)',
      },

      letterSpacing: {
        widest: '0.3em',
      },
    },
  },
  plugins: [],
};

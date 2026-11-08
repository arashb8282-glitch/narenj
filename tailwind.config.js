/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Abar', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        turquoise: {
          50: 'var(--color-turquoise-50)',
          100: 'var(--color-turquoise-100)',
          200: 'var(--color-turquoise-200)',
          500: 'var(--color-turquoise-500)',
          600: 'var(--color-turquoise-600)',
          700: 'var(--color-turquoise-700)',
        },
        orange: {
          50: 'var(--color-orange-50)',
          100: 'var(--color-orange-100)',
          200: 'var(--color-orange-200)',
          500: 'var(--color-orange-500)',
          600: 'var(--color-orange-600)',
          700: 'var(--color-orange-700)',
        },
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
        },
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
        },
        lavender: {
          50: 'var(--color-lavender-50)',
          100: 'var(--color-lavender-100)',
          200: 'var(--color-lavender-200)',
          500: 'var(--color-lavender-500)',
          600: 'var(--color-lavender-600)',
          700: 'var(--color-lavender-700)',
        },
        coral: {
          50: 'var(--color-coral-50)',
          100: 'var(--color-coral-100)',
          200: 'var(--color-coral-200)',
          500: 'var(--color-coral-500)',
          600: 'var(--color-coral-600)',
          700: 'var(--color-coral-700)',
        },
        warning: {
          100: 'var(--color-warning-100)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
        },
        danger: {
          100: 'var(--color-danger-100)',
          600: 'var(--color-danger-600)',
        },
        ink: {
          400: 'var(--color-ink-400)',
          600: 'var(--color-ink-600)',
          700: 'var(--color-ink-700)',
          900: 'var(--color-ink-900)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          sky: 'var(--color-surface-sky)',
          cream: 'var(--color-surface-cream)',
          lavender: 'var(--color-surface-lavender)',
          mint: 'var(--color-surface-mint)',
          coral: 'var(--color-surface-coral)',
        },
        canvas: {
          DEFAULT: 'var(--color-canvas)',
          warm: 'var(--color-canvas-warm)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
      },
      borderRadius: {
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        cardLg: 'var(--radius-card-lg)',
      },
      maxWidth: {
        shell: '1440px',
      },
    },
  },
  plugins: [],
};

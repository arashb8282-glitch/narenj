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
        },
        accent: {
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          500: 'var(--color-accent-500)',
          700: 'var(--color-accent-700)',
        },
        success: {
          100: 'var(--color-success-100)',
          600: 'var(--color-success-600)',
        },
        warning: {
          100: 'var(--color-warning-100)',
          600: 'var(--color-warning-600)',
        },
        danger: {
          100: 'var(--color-danger-100)',
          600: 'var(--color-danger-600)',
        },
        ink: {
          400: 'var(--color-ink-400)',
          600: 'var(--color-ink-600)',
          900: 'var(--color-ink-900)',
        },
        surface: 'var(--color-surface)',
        canvas: 'var(--color-canvas)',
        border: 'var(--color-border)',
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

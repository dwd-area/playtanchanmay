import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        'primary-soft': 'var(--primary-soft)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        success: 'var(--success)',
      },
      borderRadius: { theme: 'var(--radius)' },
      borderWidth: { theme: 'var(--border-w)' },
      boxShadow: { theme: 'var(--shadow)' },
      fontFamily: { ui: 'var(--font-ui)', display: 'var(--font-display)' },
    },
  },
} satisfies Config;

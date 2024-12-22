import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        chela: ['var(--font-chela)'],
        dela: ['var(--font-dela)'],
        roboto: ['var(--font-roboto)'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#59D9AA',
        danger: '#FF2D55',
        cyan: '#C2F1E7',
        left: '#00ffc6',
        right: '#a2ff00',
      },
    },
  },
  plugins: [],
} satisfies Config;

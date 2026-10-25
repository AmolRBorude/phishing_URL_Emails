const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'), panel: v('panel'), panel2: v('panel2'), line: v('line'), fg: v('fg'), muted: v('muted'),
        brand: { 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2' },
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      keyframes: {
        scan: { '0%': { transform: 'translateY(-120%)' }, '100%': { transform: 'translateY(520%)' } },
        toast: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { scan: 'scan 3.2s linear infinite', toast: 'toast .2s ease-out' },
    },
  },
  plugins: [],
};

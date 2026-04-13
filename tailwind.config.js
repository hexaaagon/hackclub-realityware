/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sacco: ['Sacco', 'sans-serif'],
      },
      letterSpacing: {
        'sacco': '0.02em',
      },
      fontSize: {
        'sacco-4xl': ['2.25rem', { lineHeight: '1', letterSpacing: '0.02em' }],
      },
    },
  },
  plugins: [],
};
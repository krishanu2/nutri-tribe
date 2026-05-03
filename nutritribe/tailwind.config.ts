import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sun-harvest': '#f3a213',
        'ivory-grain': '#fdfbf7',
        'earthen-rust': '#7d3627',
        'sacred-leaf': '#009846',
        'tribe-violet': '#7a4dff',
        'royal-gold-1': '#F2D57E',
        'royal-gold-2': '#D4AF37',
        'royal-gold-3': '#9A7B1F',
      },
      fontFamily: {
        display: ['var(--font-display)', '"Playfair Display"', 'serif'],
        body: ['var(--font-body)', 'Poppins', 'sans-serif'],
      },
      animation: {
        'float-slow': 'floatMakhana 8s ease-in-out infinite',
        'float-medium': 'floatMakhana 6s ease-in-out infinite 1s',
        'float-fast': 'floatMakhana 10s ease-in-out infinite 2s',
        'marquee': 'marquee 30s linear infinite',
        'wiggle': 'wiggle 0.6s ease-in-out',
      },
      keyframes: {
        floatMakhana: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '75%': { transform: 'rotate(10deg)' },
        },
      },
      boxShadow: {
        'card': '0 8px 40px rgba(125, 54, 39, 0.12)',
        'hover': '0 20px 60px rgba(125, 54, 39, 0.22)',
        'product': '0 4px 24px rgba(243, 162, 19, 0.18)',
      },
    },
  },
  plugins: [],
};
export default config;

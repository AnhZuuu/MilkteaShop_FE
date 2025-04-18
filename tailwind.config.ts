import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-15deg)' },
        '50%': { transform: 'rotate(15deg)' },
      },
      heartBeat: {
        '0%': { transform: 'scale(1);' },
        '14%': { transform: 'scale(1.3);' },
        '28%': { transform: 'scale(1);' },
        '42%': { transform: 'scale(1.3);' },
        '70%': { transform: 'scale(1);' },
      },
    },
    animation: {
      wiggle: 'wiggle 1s ease-in-out infinite',
      heartBeat: 'heartBeat 1s infinite',
    }
  },
  plugins: [],
};
export default config;

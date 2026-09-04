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
        bh: {
          bg: "#F8FAFC",
          dark: "#FFFFFF",
          card: "#FFFFFF",
          cardHover: "#F1F5F9",
          border: "rgba(212, 175, 55, 0.25)",
          borderHover: "rgba(212, 175, 55, 0.5)",
          gold: {
            DEFAULT: "#D4AF37",
            light: "#FDF0A6",
            bright: "#CA8A04",
            dark: "#854D0E",
            muted: "#B8860B",
            glow: "rgba(212, 175, 55, 0.25)"
          },
          text: {
            primary: "#0F172A",
            secondary: "#475569",
            muted: "#64748B",
            gold: "#B8860B"
          }
        }
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #997A15 100%)",
        "gold-radial": "radial-gradient(circle, rgba(212,175,55,0.2) 0%, rgba(255,255,255,0) 70%)",
        "dark-gradient": "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        "light-gradient": "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        "gold-glow": "radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15), transparent 60%)"
      },
      boxShadow: {
        "gold-sm": "0 2px 8px rgba(212, 175, 55, 0.2)",
        "gold-md": "0 4px 16px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 8px 30px rgba(212, 175, 55, 0.3)",
        "gold-inner": "inset 0 0 15px rgba(212, 175, 55, 0.15)",
        "light-card": "0 10px 30px -10px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
      },
      animation: {
        'shimmer': 'shimmer 3s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

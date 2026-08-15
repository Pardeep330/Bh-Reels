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
          bg: "#08090C",
          dark: "#0E1017",
          card: "#131622",
          cardHover: "#181B2B",
          border: "rgba(212, 175, 55, 0.2)",
          borderHover: "rgba(212, 175, 55, 0.4)",
          gold: {
            DEFAULT: "#D4AF37",
            light: "#F5E08B",
            bright: "#FFD700",
            dark: "#997A15",
            muted: "#C5A059",
            glow: "rgba(212, 175, 55, 0.3)"
          },
          text: {
            primary: "#F3F4F6",
            secondary: "#9CA3AF",
            muted: "#6B7280",
            gold: "#F3E5AB"
          }
        }
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)",
        "gold-radial": "radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(13,14,21,0) 70%)",
        "dark-gradient": "linear-gradient(180deg, #0E1017 0%, #08090C 100%)",
        "gold-glow": "radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15), transparent 60%)"
      },
      boxShadow: {
        "gold-sm": "0 0 10px rgba(212, 175, 55, 0.15)",
        "gold-md": "0 0 20px rgba(212, 175, 55, 0.25)",
        "gold-lg": "0 0 30px rgba(212, 175, 55, 0.35)",
        "gold-inner": "inset 0 0 15px rgba(212, 175, 55, 0.2)",
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

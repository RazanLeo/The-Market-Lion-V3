import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Logo-derived palette (gold on deep black, exact codes)
        bg: { DEFAULT: "#000000", soft: "#0A0A0A", card: "#0F0F0F", elev: "#141414" },
        gold: {
          50:  "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#D4AF37", // primary gold
          600: "#C9A227",
          700: "#A8821F",
          800: "#7C5E12",
          900: "#5A4209",
          DEFAULT: "#D4AF37",
        },
        signal: {
          buy:  "#16A34A", // deep green
          sell: "#DC2626", // deep red
          neutral: "#9CA3AF",
        },
        nav: { DEFAULT: "#0B1B33", deep: "#091428" }, // dark blue accents
        line: "#1f1f1f",
        muted: "#9CA3AF"
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic:  ["var(--font-arabic)", "Tajawal", "Cairo", "sans-serif"],
        display: ["var(--font-display)", "Cinzel", "Playfair Display", "serif"],
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(212,175,55,0.35), 0 8px 30px rgba(212,175,55,0.20)",
        glow: "0 0 24px rgba(212,175,55,0.25)",
      },
      keyframes: {
        shine: { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.55)" }, "50%": { boxShadow: "0 0 0 12px rgba(212,175,55,0)" } },
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
      },
      animation: {
        shine: "shine 6s ease infinite",
        pulseGold: "pulseGold 2.2s ease-in-out infinite",
        ticker: "ticker 60s linear infinite"
      }
    }
  },
  plugins: []
};
export default config;

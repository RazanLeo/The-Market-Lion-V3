import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Pure black backgrounds (matches the logo's black backdrop)
        bg: { DEFAULT: "#000000", soft: "#0A0A0A", card: "#101010", elev: "#161616" },
        // EXACT gold palette extracted from the lion logo (IMG_1732.jpg) — warm bronze gold, not bright yellow.
        gold: {
          50:  "#F5EDD4",
          100: "#ECDDA6",
          200: "#DCC580",
          300: "#CDB462", // brightest gold pixel in logo
          400: "#BFA254",
          500: "#AE9153", // average gold (DEFAULT — matches logo perfectly)
          600: "#A0783C",
          700: "#8F723A", // darkest gold pixel in logo
          800: "#6F582A",
          900: "#4D3E1E",
          DEFAULT: "#AE9153",
        },
        signal: { buy: "#16A34A", sell: "#DC2626", neutral: "#9CA3AF" },
        nav:    { DEFAULT: "#0B1B33", deep: "#091428" },
        line:   "#1f1f1f",
        muted:  "#9CA3AF",
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic:  ["var(--font-arabic)", "Tajawal", "Cairo", "sans-serif"],
        display: ["var(--font-display)", "Cinzel", "Playfair Display", "serif"],
      },
      boxShadow: {
        // Use the real gold tone for all shadows
        gold: "0 0 0 1px rgba(174,145,83,0.40), 0 8px 30px rgba(174,145,83,0.25)",
        glow: "0 0 24px rgba(174,145,83,0.28)",
      },
      keyframes: {
        shine:     { "0%,100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 0 0 rgba(174,145,83,0.55)" }, "50%": { boxShadow: "0 0 0 12px rgba(174,145,83,0)" } },
        ticker:    { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } }
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

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0C",
        charcoal: "#161418",
        gold: "#C9A24B",
        "gold-bright": "#E8CD84",
        "gold-deep": "#7C5F22",
        ivory: "#F3EEE2",
        slate: "#9A9489",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-edge":
          "linear-gradient(90deg, transparent, #C9A24B 20%, #E8CD84 50%, #C9A24B 80%, transparent)",
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;

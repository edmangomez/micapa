import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0288D1",
          "blue-hover": "#0277BD",
          "blue-dark": "#01579B",
          "blue-light": "#E1F5FE",
          green: "#2E7D32",
          "green-dark": "#1B5E20",
          "green-light": "#E8F5E9",
          lime: "#8DC63F",
          gold: "#D97706",
          "gold-hover": "#B45309",
          "gold-light": "#FFF3EA",
          cream: "#FFFDF9",
          "cream-surface": "#FDF9F3",
          dark: "#1E293B",
          charcoal: "#334155",
          muted: "#64748B",
          border: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(2, 136, 209, 0.08)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
        highlight: "0 8px 30px rgba(245, 158, 11, 0.2)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

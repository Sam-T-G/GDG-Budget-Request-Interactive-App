import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gdg: {
          blue: "#4285F4",
          red: "#EA4335",
          yellow: "#FBBC04",
          green: "#34A853",
          ink: "#1F1F1F",
          paper: "#FFFFFF",
          mist: "#F8F9FA",
          line: "#E8EAED",
          mute: "#5F6368",
        },
      },
      fontFamily: {
        sans: [
          '"Google Sans"',
          '"Google Sans Text"',
          "Roboto",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        display: ['"Google Sans Display"', '"Google Sans"', "Roboto", "system-ui", "sans-serif"],
        mono: ['"Roboto Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(60,64,67,.08), 0 2px 6px rgba(60,64,67,.08)",
        lift: "0 6px 16px rgba(60,64,67,.10), 0 2px 6px rgba(60,64,67,.06)",
      },
      animation: {
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(66,133,244,0.35)" },
          "50%": { boxShadow: "0 0 0 12px rgba(66,133,244,0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

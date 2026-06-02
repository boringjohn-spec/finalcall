import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "mac-panel": "0 18px 55px rgba(20, 28, 45, 0.16)",
        "soft-line": "0 1px 0 rgba(255, 255, 255, 0.72) inset",
      },
      colors: {
        ink: "#172033",
        mist: "#F7F8FB",
        runway: "#E9EDF5",
        signal: "#147EFB",
        spruce: "#177766",
        coral: "#DD6B4D",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Inter",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

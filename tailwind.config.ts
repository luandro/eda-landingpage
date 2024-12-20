import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "eda-green": {
          DEFAULT: "#2E7D32",
          light: "#4CAF50",
        },
        "eda-orange": {
          DEFAULT: "#FF5722",
          light: "#FFB74D",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "unwrite": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        "write": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-out-right": "slide-out-right 0.5s ease-out",
        unwrite: "unwrite 1s ease-out",
        write: "write 1s ease-out",
        pulse: "pulse 2s ease-in-out infinite",
        blink: "blink 1s step-start infinite",
      },
      backgroundImage: {
        "eda-gradient": "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
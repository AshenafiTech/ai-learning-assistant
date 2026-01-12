/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
          light: "#818CF8",
        },
        accent: {
          DEFAULT: "#06B6D4",
          soft: "#CFFAFE",
          light: "#22D3EE",
        },
        secondary: {
          DEFAULT: "#EC4899",
          light: "#F472B6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#FAFBFC",
        },
        border: "#E0E7FF",
        text: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          subtle: "#64748B",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        vibrant: "0 4px 24px 0 rgba(99, 102, 241, 0.15)",
        card: "0 2px 8px 0 rgba(99, 102, 241, 0.1)",
        accent: "0 4px 20px 0 rgba(6, 182, 212, 0.15)",
        secondary: "0 4px 20px 0 rgba(236, 72, 153, 0.15)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
      },
    },
  },
  plugins: [],
};

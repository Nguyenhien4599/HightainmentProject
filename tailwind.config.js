// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridAutoRows: {
        minmax: "minmax(0, 1fr)",
      },
      fontFamily: {
        brooklyn: ["Brooklyn", "sans-serif"],
        sans: ["Roboto", "ui-sans-serif", "system-ui"],
        appleFont: [
          '"Apple SD Gothic Neo"',
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        notoSansKr: ["Noto Sans KR", "sans-serif"],
        Anton: ["Anton", "sans-serif"],
      },
      colors: {
        customColor: {
          primary: "#EF78A0",
          bg: "#000",
          bgSideBar: "#111",
        },
      },
      lineHeight: {
        main: "19px",
      },
      screens: {
        sm: "360px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "sm-md": { min: "360px", max: "1024px" },
        "md-lg": { min: "768px", max: "1024px" },
        "lg-xl": { min: "1024px", max: "1279px" },
      },
      animation: {
        "skeleton-loading": "skeleton-loading 1.5s infinite ease-in-out",
      },
      keyframes: {
        "skeleton-loading": {
          "0%": { backgroundColor: "#555" },
          "50%": { backgroundColor: "#666" },
          "100%": { backgroundColor: "#555" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

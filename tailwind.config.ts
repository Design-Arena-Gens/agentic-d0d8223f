import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        tealAccent: "#00BFA5",
        dashboardBg: "#0B0F1A",
        panelBg: "#11182B",
        panelBorder: "#1F2A44"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      },
      boxShadow: {
        panel: "0 20px 45px -20px rgba(0, 191, 165, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;

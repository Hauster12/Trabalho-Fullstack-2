/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f97316",
          darkOrange: "#ea580c",
          blue: "#2563eb",
          darkBlue: "#1d4ed8",
          purple: "#7e22ce",
          sidebar: "#60a5fa"
        }
      }
    },
  },
  plugins: [],
}

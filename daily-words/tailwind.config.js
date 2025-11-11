/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "custom-blue-dark": "#0B2447",
        "custom-blue-light": "#576CBC",
        "custom-green": "#5D9C59",
        "custom-gray-light": "#F8F9FA",
        "custom-text-light": "#212529",
        "custom-text-dark": "#E9ECEF",
        "custom-border-light": "#DEE2E6",
        "custom-border-dark": "#343A40",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

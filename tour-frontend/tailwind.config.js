/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF5B00', // Cam Klook/GetYourGuide
        secondary: '#007AFF', // Xanh tin cậy
        customBg: '#F5F5F7',
      },
    },
  },
  plugins: [],
}
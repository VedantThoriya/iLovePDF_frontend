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
          DEFAULT: '#2C7A7B',
          primary: '#2C7A7B',
          secondary: '#1E293B',
          dark: '#236363', // Darker Teal for hover states
          light: '#38B2AC',
          bg: '#F0FDFA',
        }
      }
    },
  },
  plugins: [],
}

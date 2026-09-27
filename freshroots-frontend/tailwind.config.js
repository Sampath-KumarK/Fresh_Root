/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#FAFAF5',
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#388E3C',
          surface: '#E8F5E9',
          50: '#E8F5E9',
          100: '#C8E6C9',
          600: '#2E7D32',
          700: '#1B5E20',
          800: '#154B1A',
        },
        accent: {
          DEFAULT: '#F57C00',
          dark: '#E65100',
          light: '#FB8C00',
          surface: '#FFF3E0',
          50: '#FFF3E0',
          500: '#F57C00',
          600: '#E65100',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

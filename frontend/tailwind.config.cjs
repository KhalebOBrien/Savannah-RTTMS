/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins'],
        nunito: ['Nunito'],
      },
      colors: {
        black: '#121212',
        lightBlack: '#1B1C1E',
        white: '#F4F4F4',
        gray: '#374151',
        green: '#0CED75',
      },
    },
  },
  plugins: [],
};

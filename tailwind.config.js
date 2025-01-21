/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js.jsx,ts,tsx}",
    "./public/*.{html}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  animation: {  
    'slide-down': 'slideDown 5s ease-out'  
  } 
}


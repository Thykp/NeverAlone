/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,vue}','./src/views/**/*.{html,js,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-primeui'),
    require('@tailwindcss/forms'),
  ],
}


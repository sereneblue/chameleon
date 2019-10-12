module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#6b8e23',
        'primary-soft': '#7aa329',
        dark: '#33313b',
        'dark-softer': '#403E48',
        light: '#fbfbfb',
        'light-darker': '#C8C8C8',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/custom-forms')],
};

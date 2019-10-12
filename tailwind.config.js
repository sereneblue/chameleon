module.exports = {
  theme: {
    customForms: theme => ({
      default: {
        select: {
          borderColor: theme('colors.gray.500'),
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.5)',
            borderColor: '#6b8e23',
          },
        },
        checkbox: {
          borderColor: theme('colors.gray.500'),
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.5)',
            borderColor: '#6b8e23',
          },
        },
      },
    }),
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

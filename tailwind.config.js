module.exports = {
  theme: {
    customForms: theme => ({
      default: {
        checkbox: {
          borderColor: theme('colors.gray.500'),
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.5)',
            borderColor: theme('colors.primary'),
          },
        },
        input: {
          borderColor: theme('colors.gray.500'),
          paddingTop: theme('spacing.1'),
          paddingRight: theme('spacing.2'),
          paddingBottom: theme('spacing.1'),
          paddingLeft: theme('spacing.2'),
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.5)',
            borderColor: theme('colors.primary'),
          },
        },
        radio: {
          color: theme('colors.primary'),
          borderColor: theme('colors.gray.500'),
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.5)',
            borderColor: theme('colors.primary'),
          },
        },
        select: {
          borderColor: theme('colors.gray.500'),
          paddingTop: theme('spacing.1'),
          paddingRight: theme('spacing.2'),
          paddingBottom: theme('spacing.1'),
          paddingLeft: theme('spacing.2'),
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.5)',
            borderColor: theme('colors.primary'),
          },
        },
      },
    }),
    extend: {
      colors: {
        primary: '#6b8e23',
        'primary-soft': '#7aa329',
        dark: '#33313b',
        'dark-fg': '#403E48',
        'dark-fg-alt': '#4D4B55',
        'dark-modal': 'rgba(51, 49, 59, .8)',
        light: '#fbfbfb',
        'light-fg': '#e5e4e4',
        'light-fg-alt': '#CECDCD',
      },
      spacing: {
        '80': '20rem',
      },
      fontSize: {
        mini: '.84rem',
      },
    },
  },
  variants: {
    cursor: ['responsive', 'hover'],
  },
  plugins: [require('@tailwindcss/custom-forms')],
  purge: false,
};

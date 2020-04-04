module.exports = {
  theme: {
    extend: {
      colors: {
        'primary': '#6b8e23',
        'primary-soft': '#7aa329',
        'dark-green': '#4c6519',
        'light': '#f7fafc'
      }
    },
    customForms: theme => ({
      default: {
        input: {
          borderWidth: '1px',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.2)',
            borderColor: theme('colors.primary')
          },
        },
        textarea: {
          borderWidth: '1px',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(107, 142, 35, 0.2)',
            borderColor: theme('colors.primary')
          },
        }
      }
    }),
    spinner: theme => ({
      default: {
        color: '#dae1e7',
        size: '1em',
        border: '2px',
        speed: '500ms',
      },
    })
  },
  variants: {
    spinner: ['responsive']
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('tailwindcss-spinner')()
  ]
}

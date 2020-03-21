const production = process.env.NODE_ENV === 'production';
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.svelte", "./src/**/*.html"],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

module.exports = {
  plugins: [
    require('tailwindcss'),
    production && require('autoprefixer'),
    production && purgecss,
    production && require('cssnano')({
      preset: 'default',
    })
  ]
};
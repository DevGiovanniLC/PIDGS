/* eslint-disable no-undef */

/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },

  plugins: [require('@tailwindcss/aspect-ratio')

    , require('@tailwindcss/forms')

    , require('@tailwindcss/typography')
  ],
};

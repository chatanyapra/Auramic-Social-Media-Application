/** @type {import('tailwindcss').Config} */
export const content = [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
];
export const darkMode = 'class';
export const theme = {
  extend: {},
};
export const plugins = [];


// module.exports = {
//   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {
//       colors: {
//         blue: {
//           500: '#3B82F6',
//           600: '#2563EB',
//           700: '#1D4ED8',
//         },
//       },
//     },
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [],
// };
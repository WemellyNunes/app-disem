/** @type {import('tailwindcss').Config} */
export default {
  content: [
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            primary: {
              light: '#1351b4',
              hover: '#6082B9',
              dark: '#555555',
            },
            secondary: {
              hover: '#D7E3F5',
              back: '#FCFCFC',
              light: '#13BFD7',
            },
            tertiary: {
              light: '#2783ED',
              back: '#D9D9D9',
              border: '#CAD8F6',
            },
            status: {
              open: '#FF9900',
              bgOpen: '#FDE8C8',
              prog: '#1351B4',
              bgProg: '#CADBF6',
              resp: '#08563F',
              bgResp: '#3CD8A9',
              finish: '#042E72',
              bgFinish: '#C8D4E6',
              negative: '#851B03',
              bgNegative: '#FE9E89',
            }
          },
        },
      },
      plugins: [],
    }
    
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rawline', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


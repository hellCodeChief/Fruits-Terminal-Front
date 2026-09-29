/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        light: {
          myWhite: "#FFFFFF",
          myGray: "#f2f2f2",
          myBrown: "#cea08a",
          myBlack: "#000000",
          myColor5: "pink",
          redColor: "#FF4949",
          textGray1: "#868686",
          textGray2: "#cccccc",
          bgGray: "#f7f7f7",
        },
        dark: {},
      },
    },
  },
  plugins: [],
};

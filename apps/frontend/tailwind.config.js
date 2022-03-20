module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        desktop: "1140px",
        "5p": "50%",
        "6p": "60%",
        "6.5p": "65%",
        "8p": "80%",
        4: "40px",
        20: "200px",
        25: "250px",
        35: "350px",
        40: "400px",
        45: "450px",
        50: "500px",
        55: "550px",
        60: "600px",
        70: "700px",
        75: "750px",
        80: "800px",
      },
      minWidth: {
        2: "20px",
        4: "40px",
        10: "100px",
      },
      maxHeight: {
        4: "40px",
        20: "200px",
        30: "300px",
        40: "400px",
        50: "500px",
        60: "600px",
        70: "700px",
        80: "800px",

        // Viewport based
        "6v": "60vh",
        "7v": "70vh",
        "7.5v": "75vh",
        "8v": "80vh",
      },
      minHeight: {
        2: "20px",
        4: "40px",
        10: "100px",
      },
      transitionProperty: {
        width: "width",
        height: "height",
        "max-h": "max-height",
        border: "border",
        filter: "filter",
      },
      padding: {
        "n0.3": "3%",
      },
      borderRadius: {
        17: "17px",
        12: "12px",
      },
      scale: {
        97: "0.97",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xl: "2rem",
      },
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 600,
      bolder: 700,
      extrabold: 800,
    },
    fontFamily: {
      body: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        '"Open Sans"',
        '"Helvetica Neue"',
        "sans-serif",
      ],
    },
    fontSize: {
      sm: "12px",
      base: "14px",
      md: "17px",
      lg: "20px",
      xl: "25px",
      "2xl": "30px",
      "3xl": "35px",
      11: "11px",
      13: "13px",
      15: "15px",
      16: "16px",
    },
    colors: {
      black: "#000",
      white: "#FFF",
      transparent: "transparent",
      gray: {
        25: "var(--color-gray-25)",
        50: "var(--color-gray-50)",
        100: "var(--color-gray-100)",
        150: "var(--color-gray-150)",
        200: "var(--color-gray-200)",
        300: "var(--color-gray-300)",
        400: "var(--color-gray-400)",
        500: "var(--color-gray-500)",
        600: "var(--color-gray-600)",
        700: "var(--color-gray-700)",
        800: "var(--color-gray-800)",
        900: "var(--color-gray-900)",
        950: "var(--color-gray-950)",
      },
      brand: {
        white: "var(--color-brand-white)",
        black: "var(--color-brand-black)",
      },
    },
    spacing: {
      0: "0px",
      0.1: "1px",
      0.2: "2px",
      0.3: "3px",
      0.5: "5px",
      0.7: "7px",
      1: "10px",
      1.3: "13px",
      1.5: "15px",
      2: "20px",
      2.5: "25px",
      3: "30px",
      4: "40px",
      5: "50px",
      5.5: "55px",
      6: "60px",
      7: "70px",
      8: "80px",
      9: "90px",
      10: "100px",
      13: "130px",
      15: "150px",
      16: "160px",
      17: "170px",
      20: "200px",
      25: "250px",
      30: "300px",
      35: "350px",
      40: "400px",
      60: "600px",
      75: "750px",
      80: "800px",

      // Viewport based
      "6v": "60vh",
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0px",
      0.2: "2px",
      0.3: "3px",
    },
  },
  variants: {
    extend: {
      width: ["group-hover"],
      display: ["group-hover"],

      cursor: ["disabled"],
      backgroundColor: ["disabled"],

      scale: ["hover"],
    },
  },
  plugins: [],
};

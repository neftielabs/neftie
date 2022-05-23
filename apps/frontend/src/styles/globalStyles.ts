import tw, { globalStyles } from "twin.macro";

import { globalCss } from "stitches.config";

const customStyles = {
  body: {
    ...tw`antialiased`,
  },
};

const appStyles = {
  ":root": {
    "--color-gray-25": "#f9f9f9",
    "--color-gray-50": "#f4f5f5",
    "--color-gray-100": "#f0f1f1",
    "--color-gray-150": "#e4e8e8",
    "--color-gray-200": "#d3d6d6",
    "--color-gray-300": "#b6baba",
    "--color-gray-400": "#999e9e",
    "--color-gray-500": "#7c8383",
    "--color-gray-600": "#616666",
    "--color-gray-700": "#454949",
    "--color-gray-800": "#292c2c",
    "--color-gray-900": "#202222",
    "--color-gray-950": "#141515",

    "--color-brand-white": "#F4F4F5",
    "--color-brand-black": "#0D0D0D",

    "--color-gradient-pink": "#FF0F7B",
    "--color-gradient-orange": "#F89B29",

    "--color-error": "#ea0027",
    "--color-error-lighter": "#ffdbe1",

    "--color-success": "#16c116",

    "font-size": "15px",
    color: "var(--color-brand-black)",
  },
  html: {
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
    "overflow-y": "auto",
  },
  "*, .font-body": {
    "font-family":
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;',
  },
  "h1,h2,h3,div": { "line-height": "1.4" },
  "#__next.no-scroll": {
    overflow: "hidden",
    position: "fixed",
    width: "100%",
  },
};

const styles = () => {
  globalCss(customStyles)();
  globalCss(globalStyles as Record<any, any>)();
  globalCss(appStyles)();
};

export default styles;

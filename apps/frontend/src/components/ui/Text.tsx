import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { styled } from "stitches.config";

export const Text = styled(Box, {
  // ...tw`text-gray-900`,
  variants: {
    color: {
      brandWhite: tw`text-brand-white`,
      brandBlack: tw`text-brand-black`,
      white: tw`text-white`,
      black: tw`text-black`,
      gray200: tw`text-gray-200`,
      gray300: tw`text-gray-300`,
      gray400: tw`text-gray-400`,
      gray500: tw`text-gray-500`,
      gray600: tw`text-gray-600`,
      gray700: tw`text-gray-700`,
      gray800: tw`text-gray-800`,
      gray900: tw`text-gray-900`,
      error: tw`text-error`,
    },
    size: {
      11: tw`text-11`,
      13: tw`text-13`,
      14: tw`text-14`,
      15: tw`text-base`,
      sm: tw`text-sm`,
      md: tw`text-md`,
      lg: tw`text-lg`,
      xl: tw`text-xl`,
      "2xl": tw`text-2xl`,
      "3xl": tw`text-3xl`,
    },
    align: {
      center: tw`text-center`,
      right: tw`text-right`,
      left: tw`text-left`,
    },
    weight: {
      normal: tw`font-normal`,
      medium: tw`font-medium`,
      bold: tw`font-bold`,
      bolder: tw`font-bolder`,
      extrabold: tw`font-extrabold`,
    },
    case: {
      uppercase: tw`uppercase`,
      lowercase: tw`lowercase`,
      capitalize: tw`capitalize`,
    },
    strikeThrough: {
      true: tw`line-through`,
    },
    nowrap: {
      true: tw`whitespace-nowrap`,
    },
    tracking: {
      wider: tw`tracking-wider`,
    },
    underline: {
      true: tw`underline`,
    },
  },
});

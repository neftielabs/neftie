import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { styled } from "stitches.config";

export const BaseCard = styled(Box, {
  ...tw`border bg-white`,
  variants: {
    shadow: {
      true: tw`hover:shadow-lg transition-all`,
      false: {},
    },
    border: {
      none: {},
      light: tw`border-gray-100`,
      darker: tw`border-gray-150`,
    },
    rounded: {
      true: tw`rounded-12 overflow-hidden`,
      false: {},
    },
  },
  defaultVariants: {
    shadow: false,
    border: "light",
    rounded: true,
  },
});

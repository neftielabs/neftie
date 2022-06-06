import tw from "twin.macro";

import { styled } from "stitches.config";

export const Label = styled("label", {
  variants: {
    size: {
      lg: tw`font-bold text-16`,
      base: tw`font-medium text-base`,
      sm: {},
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

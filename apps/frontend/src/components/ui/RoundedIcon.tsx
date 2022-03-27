import { Box } from "components/ui/Box";
import { styled } from "stitches.config";
import tw from "twin.macro";

export const RoundedIcon = styled(Box, {
  ...tw`rounded-full p-1 bg-transparent transition-colors`,
  variants: {
    darker: {
      true: tw`hover:bg-gray-150`,
      false: tw`hover:bg-gray-100`,
    },
  },
  defaultVariants: {
    darker: false,
  },
});

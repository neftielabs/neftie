import { Box } from "components/ui/Box";
import { styled } from "stitches.config";
import tw from "twin.macro";

export const Flex = styled(Box, {
  ...tw`flex`,
  variants: {
    center: {
      true: tw`justify-center items-center`,
    },
    justifyBetween: {
      true: tw`justify-between`,
    },
    justifyCenter: {
      true: tw`justify-center`,
    },
    itemsCenter: {
      true: tw`items-center`,
    },
    column: {
      true: tw`flex-col`,
    },
    grow: {
      true: tw`flex-grow`,
    },
    noGrow: {
      true: tw`flex-grow-0`,
    },
    shrink: {
      true: tw`flex-shrink`,
    },
    noShrink: {
      true: tw`flex-shrink-0`,
    },
  },
});

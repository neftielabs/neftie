import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { styled } from "stitches.config";

export const ModalBox = styled(Box, {
  ...tw`rounded-12 bg-white z-50 relative
  transform transition-all duration-500 overflow-hidden`,
  variants: {
    visible: {
      true: tw`translate-y-0 opacity-100`,
      false: tw`-translate-y-3 opacity-0`,
    },
  },
  defaultVariants: {
    visible: false,
  },
});

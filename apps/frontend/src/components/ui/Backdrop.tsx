import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { styled } from "stitches.config";

export const Backdrop = styled(Box, {
  ...tw`fixed top-0 left-0 bottom-0 right-0`,
  ...tw`bg-brand-black z-index[1]`,
  ...tw`opacity-0 transform transform-gpu`,
  variants: {
    visible: {
      true: tw`opacity-50`,
      false: tw`pointer-events-none`,
    },
  },
});

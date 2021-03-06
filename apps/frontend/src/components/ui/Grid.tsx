import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { styled } from "stitches.config";

export const Grid = styled(Box, {
  ...tw`grid`,
  variants: {
    cols: {
      3: tw`grid-cols-3`,
      4: tw`grid-cols-4`,
    },
  },
});

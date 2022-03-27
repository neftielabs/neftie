import { NeftieIcon } from "components/assets/NeftieIcon";
import { AuthHeader } from "components/headers/AuthHeader";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import React from "react";

interface DesktopHeaderProps {}

export const DesktopHeader: React.FC<DesktopHeaderProps> = () => {
  return (
    <Box tw="py-3 hidden md:block">
      <Flex tw="container" justifyBetween itemsCenter>
        <Box>
          <NeftieIcon />
        </Box>
        <Box>
          <AuthHeader />
        </Box>
      </Flex>
    </Box>
  );
};

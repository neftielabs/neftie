import { NeftieIcon } from "components/assets/NeftieIcon";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import React from "react";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <Box tw="w-full py-3">
      <Flex tw="container" justifyBetween itemsCenter>
        <Box>
          <NeftieIcon tw="text-brand-black" />
        </Box>
        <Box>
          <Button>Connect wallet</Button>
        </Box>
      </Flex>
    </Box>
  );
};

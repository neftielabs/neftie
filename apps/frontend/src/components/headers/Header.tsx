import { NeftieIcon } from "components/assets/NeftieIcon";
import { Box } from "components/ui/Box";
import React from "react";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <Box tw="w-full py-3">
      <Box tw="container">
        <NeftieIcon tw="text-brand-black" />
      </Box>
    </Box>
  );
};

import React from "react";

import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";

interface TransactionBodyProps {}

export const TransactionBody: React.FC<TransactionBodyProps> = ({
  children,
}) => {
  return (
    <Flex center tw="w-full h-full bg-gray-25">
      <Box tw="bg-white rounded-12 w-1/2 py-4 my-6 border border-gray-150">
        {children}
      </Box>
    </Flex>
  );
};

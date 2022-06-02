import React from "react";

import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Text } from "components/ui/Text";

interface NotFoundNoticeProps {
  action?: JSX.Element;
}

export const NotFoundNotice: React.FC<NotFoundNoticeProps> = ({
  action,
  children,
}) => {
  return (
    <Flex column tw="w-full" center>
      <Box tw="w-8 h-8 mb-2">
        <Image src="/astronaut-not-found.png" />
      </Box>
      <Text size="lg" weight="bold" color="gray300">
        {children}
      </Text>
      {action}
    </Flex>
  );
};

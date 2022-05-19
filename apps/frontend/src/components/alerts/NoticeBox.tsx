import React from "react";

import { Box } from "components/ui/Box";
import { FiX } from "react-icons/fi";
import { styled } from "stitches.config";
import tw from "twin.macro";

const NoticeContainer = styled(Box, {
  ...tw`relative`,
  variants: {
    type: {
      error: tw`border-error`,
      info: tw`border-brand-black`,
    },
    size: {
      sm: tw`text-sm`,
      base: tw`text-base`,
    },
    style: {
      boxed: tw`p-1 pr-2.5 rounded-lg border`,
      minimal: tw`pl-1 pr-3 py-0.5 border-l-0.2 rounded-sm bg-gray-25`,
    },
  },
  defaultVariants: {
    type: "error",
    size: "sm",
    style: "boxed",
  },
});

interface NoticeBoxProps extends React.ComponentProps<typeof NoticeContainer> {
  onBoxClose?: () => void;
}

export const NoticeBox: React.FC<NoticeBoxProps> = ({
  onBoxClose,
  children,
  ...props
}) => {
  return (
    <NoticeContainer {...props}>
      {onBoxClose ? (
        <FiX onClick={onBoxClose} tw="absolute top-1 right-1 cursor-pointer" />
      ) : null}
      <Box>{children}</Box>
    </NoticeContainer>
  );
};

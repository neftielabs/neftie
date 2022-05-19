import React from "react";

import { Box } from "components/ui/Box";
import { Image } from "components/ui/Image";
import { styled } from "stitches.config";
import tw from "twin.macro";

const AvatarComponent = styled(Box, {
  ...tw`rounded-full bg-gray-300 overflow-hidden relative`,
  variants: {
    border: {
      none: {},
      md: tw`border-0.3 border-white`,
    },
    size: {
      xxs: tw`w-2 h-2`,
      xs: tw`w-2.5 h-2.5`,
      sm: tw`w-3.5 h-3.5`,
      xl: tw`w-13 h-13`,
    },
  },
  defaultVariants: {
    border: "none",
    size: "sm",
  },
});

interface AvatarProps extends React.ComponentProps<typeof AvatarComponent> {
  avatarUrl?: string | null;
  isLoading?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  isLoading = false,
  ...props
}) => {
  return (
    <AvatarComponent {...props}>
      {!isLoading && avatarUrl ? <Image src={avatarUrl} /> : null}
    </AvatarComponent>
  );
};

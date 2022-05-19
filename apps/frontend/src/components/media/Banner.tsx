import React from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Image } from "components/ui/Image";
import { Text } from "components/ui/Text";
import tw, { styled } from "twin.macro";

const BannerContainer = styled(Box, {
  ...tw`rounded-17 overflow-hidden relative container`,
});

interface BannerProps extends React.ComponentProps<typeof BannerContainer> {
  imageUrl?: string | null;
  alt?: string;
  isLoading?: boolean;
  edit?: {
    onClick: () => void;
    buttonText: string;
  };
}

export const Banner: React.FC<BannerProps> = ({
  imageUrl,
  alt = "Banner image",
  isLoading = false,
  edit,
  children,
  ...props
}) => {
  return (
    <BannerContainer {...props}>
      <Box tw="w-full h-full" className="group">
        {isLoading || !imageUrl ? (
          <Box tw="w-full h-full bg-gray-100 absolute top-0 left-0" />
        ) : (
          <Image noContainer src={imageUrl} alt={alt} />
        )}
        {edit ? (
          <>
            <Button
              theme="white"
              tw="shadow-md absolute right-3 bottom-2 transform translate-y-20
            group-hover:translate-y-0 "
              size="sm"
              onClick={edit.onClick}
            >
              <Text size="13">{edit.buttonText}</Text>
            </Button>
          </>
        ) : null}
        {children}
      </Box>
    </BannerContainer>
  );
};

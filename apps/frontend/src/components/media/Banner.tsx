import React from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Image } from "components/ui/Image";
import { Text } from "components/ui/Text";

interface BannerProps extends React.ComponentProps<typeof Box> {
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
    <Box tw="overflow-hidden relative" {...props}>
      <Box tw="w-full h-full" className="group">
        {isLoading || !imageUrl ? (
          <Box tw="w-full h-full bg-gray-100 absolute top-0 left-0" />
        ) : (
          <Image noContainer src={imageUrl} alt={alt} />
        )}
        <Container tw="relative h-full">
          {edit ? (
            <Box tw="mb-2 absolute right-3.5 bottom-0">
              <Button
                theme="white"
                tw="shadow-md transform transform[translateY(calc(100% + 20px))]
                group-hover:translate-y-0"
                size="sm"
                onClick={edit.onClick}
              >
                <Text size="13">{edit.buttonText}</Text>
              </Button>
            </Box>
          ) : null}
          {children}
        </Container>
      </Box>
    </Box>
  );
};

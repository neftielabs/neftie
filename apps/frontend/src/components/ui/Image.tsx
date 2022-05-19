import React from "react";

import { Box } from "components/ui/Box";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { styled } from "stitches.config";
import tw from "twin.macro";

const ImageWrapper = styled(Box, {
  variants: {
    fill: {
      true: tw`relative w-full h-full`,
      false: {},
    },
  },
  defaultVariants: {
    fill: false,
  },
});

interface ImageProps extends NextImageProps {
  noContainer?: boolean;
}

export const Image: React.FC<ImageProps> = ({
  noContainer = false,
  layout = "fill",
  ...props
}) => {
  return (
    <>
      {noContainer ? (
        <NextImage
          objectFit={layout === "fill" ? "cover" : undefined}
          layout={layout}
          {...props}
        />
      ) : (
        <ImageWrapper fill={layout === "fill"}>
          <NextImage
            objectFit={layout === "fill" ? "cover" : undefined}
            layout={layout}
            {...props}
          />
        </ImageWrapper>
      )}
    </>
  );
};

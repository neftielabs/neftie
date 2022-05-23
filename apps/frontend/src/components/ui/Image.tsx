import React from "react";

import type { ImageProps as NextImageProps } from "next/image";
import NextImage from "next/image";
import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { styled } from "stitches.config";

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

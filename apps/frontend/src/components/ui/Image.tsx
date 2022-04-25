import React from "react";
import NextImage, { ImageProps as NextImageProps } from "next/image";
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
  const image = (
    <NextImage
      objectFit={layout === "fill" ? "cover" : undefined}
      layout={layout}
      {...props}
    />
  );

  return (
    <>
      {noContainer ? (
        image
      ) : (
        <ImageWrapper fill={layout === "fill"}>{image}</ImageWrapper>
      )}
    </>
  );
};

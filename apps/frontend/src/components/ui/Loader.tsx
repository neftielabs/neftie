import { Box } from "components/ui/Box";
import React from "react";
import { styled } from "stitches.config";
import tw from "twin.macro";
import { styleUtils } from "utils/style";

const Container = styled(Box, {
  variants: {
    centered: {
      true: tw`w-full flex items-center justify-center`,
    },
    absoluteCentered: {
      true: styleUtils.center.xy,
    },
  },
});

interface LoaderProps extends React.ComponentProps<typeof Container> {
  active?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  centered = false,
  absoluteCentered = false,
  active = true,
  ...props
}) => {
  return (
    <Container
      centered={centered}
      absoluteCentered={absoluteCentered}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        tw="w-2 h-2 animation-duration[1.05s] animation-timing-function[cubic-bezier(.39,.6,.81,.58)]"
        css={active ? tw`animate-spin` : {}}
        viewBox="0 0 34 33.1"
        fill="currentColor"
      >
        <path
          fill="currentColor"
          d="M17,0C7.62,0,0,7.62,0,17c0,7.46,4.84,13.83,11.55,16.1l1.6-4.74c-4.74-1.6-8.15-6.09-8.15-11.36,0-6.62,5.38-12,12-12s12,5.38,12,12c0,5.14-3.26,9.54-7.81,11.24l1.76,4.69c6.45-2.42,11.05-8.65,11.05-15.93C34,7.62,26.37,0,17,0Z"
        />
      </svg>
    </Container>
  );
};

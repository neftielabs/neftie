import { styled } from "stitches.config";
import tw from "twin.macro";
import React from "react";
import { Box } from "components/ui/Box";
import { Loader } from "components/ui/Loader";

const ButtonComponent = styled("button", {
  ...tw`flex items-center justify-center disabled:cursor-not-allowed transition-all relative`,
  variants: {
    theme: {
      gray: tw`bg-gray-150 text-gray-700 hover:bg-gray-200`,
      black: tw`bg-brand-black text-brand-white hover:bg-gray-800 disabled:bg-gray-300`,
    },
    shape: {
      circle: tw`rounded-full flex items-center justify-center`,
    },
    size: {
      base: tw`px-2 py-1.3`,
      lg: tw`px-2 py-1.5`,
      xl: tw`px-2.5 py-2`,
    },
    text: {
      sm: tw`text-sm`,
      base: tw`text-base`,
      "15": tw`text-15`,
      md: tw`text-md`,
      lg: tw`text-md`,
    },
    sharp: {
      true: {},
      false: tw`rounded-12`,
    },
    bold: {
      true: tw`font-bold`,
    },
  },
  defaultVariants: {
    theme: "black",
    text: "base",
    size: "base",
    sharp: false,
    bold: true,
  },
});

interface ButtonProps extends React.ComponentProps<typeof ButtonComponent> {
  isLoading?: boolean;
  loader?: React.ReactElement;
  animated?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  loader,
  animated = true,
  children,
  ...props
}) => {
  const loaderComponent = loader || <Loader absoluteCentered />;

  return (
    <ButtonComponent {...props}>
      {animated ? (
        <>
          <Box
            tw="opacity-0 transition-opacity"
            css={isLoading ? tw`opacity-100` : {}}
          >
            {loaderComponent}
          </Box>
          <Box
            tw="opacity-100 transition-opacity w-full"
            css={isLoading ? tw`opacity-0` : {}}
          >
            {children}
          </Box>
        </>
      ) : (
        <>{isLoading ? loaderComponent : children}</>
      )}
    </ButtonComponent>
  );
};

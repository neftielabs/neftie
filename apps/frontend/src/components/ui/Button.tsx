import React from "react";

import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { Loader } from "components/ui/Loader";
import { styled } from "stitches.config";

const gradientCommonProps = {
  ...tw`text-white font-bolder`,
  transitionProperty:
    "background-position, background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
  transitionDuration:
    "0.5s, 0.2s, 0.2s, 0.2s, 0.2s, 0.2s, 0.2s, 0.2s, 0.2s, 0.2s, 0.2s",
  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundSize: "200%",
  "&:hover": {
    backgroundPosition: "-100%",
  },
};

const ButtonComponent = styled("button", {
  ...tw`flex items-center justify-center disabled:cursor-not-allowed transition relative duration-200`,
  variants: {
    theme: {
      none: {},
      gray: tw`bg-gray-150 text-gray-800 hover:bg-gray-200`,
      black: tw`bg-brand-black text-brand-white hover:bg-gray-800 disabled:bg-gray-300`,
      white: tw`bg-white text-gray-800 hover:bg-gray-50`,
      outlineWhite: tw`border border-white hover:border-gray-300`,
      gradientOrange: {
        ...gradientCommonProps,
        backgroundImage: `linear-gradient(100deg, #FF0F7B, #F89B29, #FF0F7B)`,
      },
      gradientBlue: {
        ...gradientCommonProps,
        backgroundImage: `linear-gradient(100deg, #ff1b6b, #45caff, #ff1b6b)`,
      },
    },
    shape: {
      circle: tw`rounded-full flex items-center justify-center`,
    },
    size: {
      none: {},
      sm: tw`px-1.5 py-1`,
      base: tw`px-2 py-1.5`,
      lg: tw`px-2 py-1.5`,
      xl: tw`px-2.5 py-2`,
    },
    text: {
      sm: tw`text-sm`,
      base: tw`text-base`,
      13: tw`text-13`,
      "14": tw`text-14`,
      md: tw`text-md`,
      lg: tw`text-lg`,
    },
    sharp: {
      true: {},
      false: tw`rounded-full`,
    },
    bold: {
      true: tw`font-bold`,
    },
    spring: {
      true: tw`active:scale-97`,
      false: {},
    },
  },
  defaultVariants: {
    theme: "black",
    text: "base",
    size: "base",
    sharp: false,
    bold: true,
    spring: true,
  },
});

export interface ButtonProps
  extends React.ComponentProps<typeof ButtonComponent> {
  isLoading?: boolean;
  loader?: React.ReactElement;
  animated?: boolean;
  raw?: false | undefined;
}

interface RawButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  raw: true;
}

export const Button: React.FC<ButtonProps | RawButtonProps> = (props) => {
  if ("raw" in props && props.raw === true) {
    const { raw, children, ...buttonProps } = props;

    return <button {...buttonProps}>{children}</button>;
  }

  const {
    isLoading = false,
    loader,
    animated = true,
    children,
    ...buttonProps
  } = props;

  const loaderComponent = loader || (
    <Loader tw="text-brand-white" absoluteCentered active={isLoading} />
  );

  return (
    <>
      <ButtonComponent
        disabled={buttonProps.disabled || isLoading}
        {...buttonProps}
      >
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
    </>
  );
};

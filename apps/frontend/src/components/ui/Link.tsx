import React from "react";

import { Box } from "components/ui/Box";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { styled } from "stitches.config";
import tw from "twin.macro";

const sharedStyles = {
  ...tw`transition-colors duration-150`,
  variants: {
    variant: {
      raw: {},
      blackToDim: tw`text-brand-black hover:text-gray-600`,
      dimToBlack: tw`text-gray-600 hover:text-brand-black`,
      dimToLight: tw`text-gray-600 hover:text-gray-500`,
      dimToLighter: tw`text-gray-600 hover:text-gray-200`,
      dimToWhite: tw`text-gray-600 hover:text-brand-white`,
      whiteToLighter: tw`text-brand-white hover:text-gray-200`,
      lightToWhite: tw`text-gray-500 hover:text-brand-white`,
    },
    underline: {
      true: tw`hover:underline`,
    },
  },
  defaultVariants: {
    underline: false,
  },
};

const LinkElement = styled("a", sharedStyles);
const DivElement = styled(Box, sharedStyles);

export interface AnchorLinkProps
  extends React.ComponentProps<typeof LinkElement> {
  active?: boolean;
  target?: string;
  nextLinkProps?: NextLinkProps;
  href: string;
  prefetch?: boolean;
}

interface DivLinkProps extends React.ComponentProps<typeof DivElement> {
  active?: boolean;
  target?: string;
  nextLinkProps?: NextLinkProps;
  asButton?: boolean;
}

export const Link: React.FC<AnchorLinkProps | DivLinkProps> = ({
  variant = "raw",
  active,
  target,
  children,
  nextLinkProps,
  underline,
  ...props
}) => {
  if ("href" in props) {
    return (
      <NextLink
        {...nextLinkProps}
        href={props.href}
        passHref
        prefetch={props.prefetch}
      >
        <LinkElement
          underline={underline}
          variant={variant}
          target={target}
          {...props}
        >
          {children}
        </LinkElement>
      </NextLink>
    );
  }

  const { asButton, ...buttonProps } = props;

  return (
    <>
      <DivElement
        variant={variant}
        underline={underline}
        css={asButton ? { cursor: "pointer" } : {}}
        {...buttonProps}
      >
        {children}
      </DivElement>
    </>
  );
};

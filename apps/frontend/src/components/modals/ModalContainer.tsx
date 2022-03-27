import { Flex } from "components/ui/Flex";
import { styled } from "stitches.config";
import tw from "twin.macro";

export const ModalContainer = styled(Flex, {
  ...tw`fixed top-0 left-0 w-screen h-screen z-50
  opacity-0 invisible pointer-events-none`,
  variants: {
    visible: {
      true: {
        ...tw`opacity-100 visible pointer-events-auto`,
        transition: "opacity .2s, visibility 0s, transform .25s ease",
      },
      false: {
        transition:
          "opacity .2s, visibility 0s linear .2s, transform .25s ease",
      },
    },
  },
  defaultVariants: {
    visible: false,
  },
});

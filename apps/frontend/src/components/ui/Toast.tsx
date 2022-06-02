import React, { useEffect } from "react";

import { FiX } from "react-icons/fi";
import tw, { styled } from "twin.macro";

import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useToastStore } from "stores/useToastStore";

const ToastContainer = styled(Flex, {
  ...tw`w-full fixed bottom-0 z-index[1000]
  transform translate-y-full opacity-0 invisible overflow-hidden`,
  variants: {
    visible: {
      true: {
        ...tw`opacity-100 visible translate-y-0`,
        transition: "opacity .2s, visibility 0s, transform .25s ease",
      },
      false: {
        transition:
          "opacity .2s, visibility 0s linear .2s, transform .25s ease",
      },
    },
  },
});

interface ToastProps {}

export const Toast: React.FC<ToastProps> = () => {
  const { toast, hideToast, state } = useToastStore();

  useEffect(() => {
    if (!toast || !toast.duration) {
      return;
    }

    const timeoutId = setTimeout(() => {
      hideToast();
    }, toast.duration);

    return () => clearTimeout(timeoutId);
  }, [hideToast, toast]);

  return (
    <>
      <ToastContainer justifyCenter visible={state === "open"}>
        <Flex
          center
          tw="bg-gray-100 mb-3 rounded-12 bg-brand-black border border-gray-700 overflow-hidden"
        >
          {toast?.isLoading ? (
            <Loader tw="text-brand-white pl-2" svgProps={{ width: 20 }} />
          ) : null}

          <Text tw="px-2 py-2" color="brandWhite">
            {toast?.message}
          </Text>

          <Button
            size="none"
            theme="none"
            sharp
            tw="px-2 hover:bg-gray-800 h-full border-l border-gray-800"
            onClick={() => hideToast()}
          >
            <FiX tw="text-gray-600" />
          </Button>
        </Flex>
      </ToastContainer>
    </>
  );
};

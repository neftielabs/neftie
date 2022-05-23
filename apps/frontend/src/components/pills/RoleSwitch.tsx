import React, { useState } from "react";

import { pipe } from "fp-ts/lib/function";
import tw from "twin.macro";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { styled } from "stitches.config";

const SwitchOption = styled(Text, {
  ...tw`flex-basis[50%] px-3 font-medium text-14 transition-colors py-0.7 relative`,
  variants: {
    active: { true: tw`text-gray-900`, false: tw`text-gray-700` },
  },
});

interface RoleSwitchProps<T extends readonly [string, string]> {
  options: T;
  onSwitch: (active: T[number]) => Promise<void>;
}

export const RoleSwitch = <T extends readonly [string, string]>({
  options,
  onSwitch,
}: RoleSwitchProps<T>) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleSwitch = async (o: T[number]) => {
    setIsSwitchLoading(true);
    await onSwitch(o);
    setIsSwitchLoading(false);
  };

  return (
    <Flex tw="relative border border-gray-150 rounded-12 overflow-hidden">
      {options.map((o, i) => (
        <Button
          raw
          key={o + i}
          tw="z-10"
          onClick={() => pipe(i, setActiveIndex, () => handleSwitch(o))}
          disabled={isSwitchLoading && i === activeIndex}
          css={
            isSwitchLoading && i === activeIndex
              ? tw`cursor-not-allowed pointer-events-none`
              : {}
          }
        >
          <SwitchOption active={i === activeIndex}>
            <Loader
              tw="opacity-0 transition-opacity"
              absoluteCentered
              active={isSwitchLoading && i === activeIndex}
              svgProps={{ width: 16 }}
              css={isSwitchLoading && i === activeIndex ? tw`opacity-100` : {}}
            />
            <Text
              as="span"
              tw="opacity-100 transition-opacity"
              css={isSwitchLoading && i === activeIndex ? tw`opacity-0` : {}}
            >
              {options[i]}
            </Text>
          </SwitchOption>
        </Button>
      ))}
      <Box
        tw="w-1/2 h-full top-0 left-0 bg-gray-200 rounded-md absolute transform transition-all"
        css={activeIndex === 0 ? tw`translate-x-0` : tw`translate-x-full`}
      />
    </Flex>
  );
};

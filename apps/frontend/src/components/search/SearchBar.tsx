import React, { useRef } from "react";

import { useClickOutside, useToggle } from "@react-hookz/web";
import { FiSearch } from "react-icons/fi";
import tw from "twin.macro";

import { Backdrop } from "components/ui/Backdrop";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { styled } from "stitches.config";

const SearchContainer = styled(Box, {
  ...tw`px-1 pt-1 rounded-12 absolute top-0 left-0 bg-transparent transition-all duration-300`,
  variants: {
    open: {
      true: tw`bg-gray-50`,
      false: {},
    },
  },
});

const SearchInput = styled(Flex, {
  ...tw`bg-gray-50 rounded-full pl-2 width[300px] border border-gray-100 overflow-hidden mb-1
  transition-all duration-300`,
  variants: {
    open: {
      true: tw`bg-white width[500px] border-gray-150`,
      false: {},
    },
  },
});

interface SearchBarProps {}

export const SearchBar: React.FC<SearchBarProps> = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => isOpen && toggleIsOpen());

  return (
    <Box tw="height[60px] width[500px] relative z-20">
      <SearchContainer open={isOpen} ref={ref}>
        <SearchInput itemsCenter open={isOpen}>
          <FiSearch tw="mr-1 flex-shrink-0" />
          <input
            type="text"
            tw="bg-transparent py-1 px-1 w-full outline-none"
            placeholder="Search"
            onFocus={() => toggleIsOpen(true)}
          />
        </SearchInput>

        {isOpen ? (
          <>
            <Text align="center" tw="py-2">
              Coming soon!
            </Text>
          </>
        ) : null}
      </SearchContainer>
      <Backdrop visible={isOpen} tw="z-index[-1] transition-opacity" />
    </Box>
  );
};

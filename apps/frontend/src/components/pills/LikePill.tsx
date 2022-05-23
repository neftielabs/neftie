import React from "react";

import { IoHeart, IoHeartOutline } from "react-icons/io5";
import tw from "twin.macro";

import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { styled } from "stitches.config";

const PillContainer = styled(Flex, {
  ...tw`border rounded-md px-1 py-0.5
  gap-0.5`,
  variants: {
    active: {
      true: tw`bg-error-lighter border-error text-error`,
      false: tw`bg-gray-25 hover:bg-gray-50 border-gray-150 text-gray-600`,
    },
  },
});

interface LikePillProps {
  amount: string | number;
  active?: boolean;
  onLike: () => void;
}

export const LikePill: React.FC<LikePillProps> = ({
  amount,
  onLike,
  active = false,
}) => {
  return (
    <PillContainer
      as="button"
      type="button"
      itemsCenter
      onClick={onLike}
      active={active}
    >
      {active ? (
        <IoHeart tw="text-error" size="14" />
      ) : (
        <IoHeartOutline size="14" />
      )}
      <Text size="13">{amount}</Text>
    </PillContainer>
  );
};

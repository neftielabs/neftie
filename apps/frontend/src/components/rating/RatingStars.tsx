import React from "react";

import { FiStar } from "react-icons/fi";

import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";

interface RatingStarsProps {}

export const RatingStars: React.FC<RatingStarsProps> = () => {
  return (
    <Flex itemsCenter tw="text-gray-600">
      {new Array(5).fill(null).map((_, i) => (
        <FiStar key={i} size="14" strokeWidth={0.9} />
      ))}
      <Text size="11" color="gray500" tw="ml-0.5 mt-0.1">
        (0)
      </Text>
    </Flex>
  );
};

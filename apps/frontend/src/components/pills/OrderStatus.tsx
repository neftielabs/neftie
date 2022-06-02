import React from "react";

import type { OrderStatusType } from "@neftie/common";
import { string } from "@neftie/common";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";

interface OrderStatusProps {
  status: OrderStatusType;
  underRevision: boolean;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  underRevision,
}) => {
  const themeMap: Record<OrderStatusType, string> = {
    PLACED: "#16C784",
    DISMISSED: "#F74343",
    ONGOING: "#16C784",
    CANCELLED: "#F74343",
    DELIVERED: "#9414FF",
    COMPLETED: "#16C784",
  };

  // eslint-disable-next-line no-nested-ternary
  const currentBg = underRevision
    ? "#FF8D14"
    : status in themeMap
    ? themeMap[status]
    : "#CCC";

  return (
    <Flex
      center
      tw="rounded-lg shadow-sm px-1 py-0.5"
      css={{ background: currentBg }}
    >
      <Text weight="bold" size="sm" color="white">
        {underRevision ? "Revision" : string.capitalize(status, true)}
      </Text>
    </Flex>
  );
};

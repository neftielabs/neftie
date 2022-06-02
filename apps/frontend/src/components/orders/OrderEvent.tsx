import React, { useMemo } from "react";

import type { IconType } from "react-icons";
import tw from "twin.macro";

import type { IOrderFull, IOrderStatusEvent, MergedUser } from "@neftie/common";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { routes } from "lib/manifests/routes";
import { getDisplayName, usernameOrId } from "utils/misc";
import { styleUtils } from "utils/style";

interface OrderEventProps {
  icon: IconType;
  iconColor: string;
  iconBg: string;
  iconSize?: number;
  bg: string;
  label: string;
  event: IOrderStatusEvent;
  order: IOrderFull;
  skipFrom?: boolean;
  isNextEvent?: boolean;
  isPrevEvent?: boolean;
}

export const OrderEvent: React.FC<OrderEventProps> = ({
  icon: Icon,
  iconColor,
  iconSize = 18,
  iconBg,
  bg,
  label,
  event,
  order,
  skipFrom = false,
  isNextEvent = false,
  isPrevEvent = false,
  children,
}) => {
  const eventFrom = useMemo(() => {
    if (skipFrom) {
      return null;
    }

    let user: MergedUser | "You" = "You";

    if (order.isSeller && event.from !== "seller") {
      user = order.client;
    } else if (!order.isSeller && event.from !== "client") {
      user = order.seller;
    }

    if (user === "You") {
      return "You";
    }

    return (
      <Link href={routes.user(usernameOrId(user)).index} variant="blackToDim">
        <Text weight="bold" as="span">
          {getDisplayName(user)}
        </Text>
      </Link>
    );
  }, [event.from, order.client, order.isSeller, order.seller, skipFrom]);

  return (
    <Flex
      tw="px-3 py-2"
      css={{
        background: bg,
        ...(isNextEvent ? {} : tw`mb-2`),
        ...(isPrevEvent ? {} : tw`mt-2`),
      }}
      itemsCenter
      justifyBetween
    >
      <Flex itemsCenter tw="gap-2 w-full relative z-10">
        <Flex center tw="flex-shrink-0 relative">
          <Flex
            center
            tw="w-4 h-4 rounded-full flex-shrink-0 relative shadow-lg"
            css={{ backgroundColor: iconBg }}
          >
            {React.cloneElement(<Icon />, {
              color: iconColor,
              size: iconSize,
            })}
          </Flex>

          <Box
            tw="width[140%] height[140%] bg-black rounded-full z-index[-1]"
            css={{
              ...styleUtils.center.xy,
              backgroundColor: bg,
            }}
          />

          <Box
            tw="width[120%] height[120%] bg-black rounded-full z-index[-1]"
            css={{
              ...styleUtils.center.xy,
              backgroundColor: iconBg,
              opacity: 0.09,
            }}
          />
          <Box
            tw="width[140%] height[140%] bg-black rounded-full z-index[-1]"
            css={{
              ...styleUtils.center.xy,
              backgroundColor: iconBg,
              opacity: 0.05,
            }}
          />
        </Flex>

        <Flex column tw="w-full">
          <Flex itemsCenter justifyBetween tw="mb-0.5 w-full">
            <Text tw="color[rgba(0,0,0,0.8)]" weight="medium">
              {eventFrom} {label}
            </Text>
            <Text size="13" tw="color[rgba(0,0,0,0.3)]">
              {new Intl.DateTimeFormat("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(Number(event.timestamp) * 1000)}
            </Text>
          </Flex>
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};

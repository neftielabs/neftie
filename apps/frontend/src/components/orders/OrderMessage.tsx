import React, { useMemo } from "react";

import type {
  IOrderFull,
  IOrderMessageEvent,
  MergedUser,
} from "@neftie/common";
import { Avatar } from "components/media/Avatar";
import { ExpandableImage } from "components/media/ExpandableImage";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { routes } from "lib/manifests/routes";
import { onlyTrue } from "utils/fp";
import { getDisplayName, usernameOrId } from "utils/misc";

interface OrderMessageProps {
  message: IOrderMessageEvent;
  order: IOrderFull;
}

export const OrderMessage: React.FC<OrderMessageProps> = ({
  message,
  order,
}) => {
  const user = message.from === "client" ? order.client : order.seller;

  const messageFromTo = useMemo(() => {
    let from: MergedUser | "You" = "You";
    let to: MergedUser | "you" = "you";

    if (order.isSeller && message.from === "seller") {
      from = "You";
      to = order.client;
    } else if (order.isSeller && message.from !== "seller") {
      from = order.client;
      to = "you";
    } else if (!order.isSeller && message.from === "client") {
      from = "You";
      to = order.seller;
    } else {
      from = order.seller;
      to = "you";
    }

    return (
      <>
        {from === "You" ? (
          "You"
        ) : (
          <Link
            href={routes.user(usernameOrId(from)).index}
            variant="blackToDim"
          >
            <Text weight="medium" as="span">
              {getDisplayName(from)}
            </Text>
          </Link>
        )}{" "}
        sent{" "}
        {to === "you" ? (
          "you"
        ) : (
          <Link href={routes.user(usernameOrId(to)).index} variant="blackToDim">
            <Text weight="medium" as="span">
              {getDisplayName(to)}
            </Text>
          </Link>
        )}{" "}
        a message
      </>
    );
  }, [message.from, order.client, order.isSeller, order.seller]);

  return (
    <Flex tw="z-10 gap-2 pr-3 pl-2.5 py-2" itemsCenter justifyBetween>
      <Flex tw="gap-1.5 items-start w-full">
        <Avatar
          size="md"
          tw="border-0.5 border-white flex-shrink-0"
          avatarUrl={user.user?.avatarUrl}
        />
        <Flex column tw="w-full pt-1">
          <Flex itemsCenter justifyBetween tw="mb-0.5 w-full">
            <Text color="gray500">{messageFromTo}</Text>

            <Text size="13" color="gray400" tw="flex-shrink-0">
              {new Intl.DateTimeFormat("default", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(Number(message.timestamp) * 1000)}
            </Text>
          </Flex>
          <Text color="gray900" tw="word-break[break-all]">
            {message.message}
          </Text>

          {onlyTrue(
            <ExpandableImage
              tw="h-10 w-15 rounded-12 overflow-hidden mt-1"
              imageProps={{ src: message.mediaUrl! }}
            />
          )(!!message.mediaUrl)}
        </Flex>
      </Flex>
    </Flex>
  );
};

import React from "react";

import { guard } from "fp-ts-std/Function";
import {
  FiArrowRightCircle,
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiUserCheck,
  FiUserX,
  FiX,
} from "react-icons/fi";
import { HiLockClosed } from "react-icons/hi";
import { MdRotateLeft } from "react-icons/md";

import type { IOrderEvent, IOrderFull } from "@neftie/common";
import { BaseCard } from "components/cards/BaseCard";
import { OrderEvent } from "components/orders/OrderEvent";
import { OrderMessage } from "components/orders/OrderMessage";
import { OrderMessageBox } from "components/orders/OrderMessageBox";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";

interface OrderFeedProps {
  order: IOrderFull;
}

export const OrderFeed: React.FC<OrderFeedProps> = ({ order }) => {
  const isLocked = ["COMPLETED", "DISMISSED", "CANCELLED"].includes(
    order.status
  );

  return (
    <BaseCard as={Flex} column tw="flex-basis[70%] pt-5 pb-3 self-start gap-3">
      <Flex column tw="relative w-full h-full pt-3 pb-1">
        <Box tw="absolute w-0.1 h-full left-5 top-0 pb-0">
          <Box tw="w-full h-full bg-gray-100" />
        </Box>

        {order.events.map((event, i) => {
          const isPrevEvent = i !== 0 && order.events[i - 1].type !== "message";
          const isNextEvent =
            order.events.length >= i + 2 &&
            order.events[i + 1].type !== "message";

          if ("message" in event) {
            return (
              <OrderMessage
                key={event.type + i}
                message={event}
                order={order}
              />
            );
          }

          return (
            <React.Fragment key={event.type + i}>
              {guard<IOrderEvent["type"], JSX.Element>([
                [
                  (type) => type === "PLACED",
                  () => (
                    <OrderEvent
                      icon={FiArrowRightCircle}
                      iconColor="#FFF"
                      iconBg="#16C784"
                      bg="#F7FDFB"
                      label="placed the order"
                      event={event}
                      order={order}
                      isNextEvent={isNextEvent}
                      isPrevEvent={isPrevEvent}
                    />
                  ),
                ],
                [
                  (type) => type === "DISMISSED",
                  () => (
                    <OrderEvent
                      icon={FiUserX}
                      iconColor="#FFF"
                      iconBg="#F74343"
                      bg="#FFFAFA"
                      label="dismissed the order"
                      event={event}
                      order={order}
                      isNextEvent={isNextEvent}
                      isPrevEvent={isPrevEvent}
                    />
                  ),
                ],
                [
                  (type) => type === "STARTED",
                  () => (
                    <>
                      <OrderEvent
                        icon={FiUserCheck}
                        iconColor="#FFF"
                        iconBg="#16C784"
                        bg="#F7FDFB"
                        label="accepted the order"
                        event={event}
                        order={order}
                        isNextEvent={true}
                        isPrevEvent={isPrevEvent}
                      />
                      <OrderEvent
                        icon={FiClock}
                        iconColor="#FFF"
                        iconBg="#16C784"
                        bg="#F7FDFB"
                        label="Order started"
                        event={event}
                        order={order}
                        skipFrom
                        isNextEvent={isNextEvent}
                        isPrevEvent={true}
                      />
                    </>
                  ),
                ],
                [
                  (type) => type === "CANCELLED",
                  () => (
                    <>
                      <OrderEvent
                        icon={FiX}
                        iconColor="#FFF"
                        iconBg="#F74343"
                        bg="#FFFAFA"
                        label="cancelled the order"
                        event={event}
                        order={order}
                        isNextEvent={isNextEvent}
                        isPrevEvent={isPrevEvent}
                      />
                    </>
                  ),
                ],
                [
                  (type) => type === "DELIVERED",
                  () => (
                    <OrderEvent
                      icon={FiPackage}
                      iconColor="#FFF"
                      iconBg="#9414FF"
                      bg="#FDF9FF"
                      label="delivered the order"
                      event={event}
                      order={order}
                      isNextEvent={isNextEvent}
                      isPrevEvent={isPrevEvent}
                    />
                  ),
                ],
                [
                  (type) => type === "REVISION",
                  () => (
                    <OrderEvent
                      icon={MdRotateLeft}
                      iconColor="#FFF"
                      iconBg="#FF8D14"
                      bg="rgb(255, 252, 248)"
                      iconSize={19}
                      label="requested a revision"
                      event={event}
                      order={order}
                      isNextEvent={isNextEvent}
                      isPrevEvent={isPrevEvent}
                    />
                  ),
                ],
                [
                  (type) => type === "COMPLETED",
                  () => (
                    <>
                      <OrderEvent
                        icon={FiCheckCircle}
                        iconColor="#FFF"
                        iconBg="#16C784"
                        bg="#F7FDFB"
                        label="Order completed"
                        event={event}
                        order={order}
                        skipFrom
                      />
                    </>
                  ),
                ],
              ])(() => <></>)(event.type)}
            </React.Fragment>
          );
        })}
      </Flex>

      {isLocked ? (
        <Flex column center tw="w-full gap-1 pb-2">
          <HiLockClosed size="19" tw="text-gray-500" />
          <Text
            size="14"
            weight="bold"
            color="gray500"
            tw="w-2/4"
            align="center"
          >
            The order is locked and no further interaction with the{" "}
            {order.isSeller ? "client" : "seller"} is allowed.
          </Text>
        </Flex>
      ) : (
        <Box tw="mt-0">
          <OrderMessageBox
            orderId={order.composedId}
            isSeller={order.isSeller}
          />
        </Box>
      )}
    </BaseCard>
  );
};

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
import { IoTime } from "react-icons/io5";
import { MdRotateLeft } from "react-icons/md";

import type { IOrderEvent, IOrderFull } from "@neftie/common";
import { BaseCard } from "components/cards/BaseCard";
import { OrderActions } from "components/orders/OrderActions";
import { OrderEvent } from "components/orders/OrderEvent";
import { OrderMessage } from "components/orders/OrderMessage";
import { OrderMessageBox } from "components/orders/OrderMessageBox";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { useOrderActions } from "hooks/contracts/useOrderActions";
import { routes } from "lib/manifests/routes";
import { shortenAddress } from "utils/web3";

interface OrderFeedProps {
  order: IOrderFull;
}

export const OrderFeed: React.FC<OrderFeedProps> = ({ order }) => {
  const {
    approve: { mutateAsync: approveOrder, isLoading: isApproving },
    dismiss: { mutateAsync: dismissOrder, isLoading: isDismissing },
  } = useOrderActions(order);

  const isLocked = ["COMPLETED", "DISMISSED", "CANCELLED"].includes(
    order.status
  );

  return (
    <BaseCard as={Flex} column tw="flex-basis[70%] pt-3 pb-3 self-start">
      <Flex justifyBetween tw="px-3 gap-0.5 pb-3 border-b border-gray-100">
        <Box>
          <Text size="2xl" weight="bold" tw="mb-0.5">
            Order #{order.id}
          </Text>

          <Text size="14" color="gray400">
            on listing{" "}
            <Link underline href={routes.listing(order.listing.id).index}>
              {shortenAddress(order.listing.id, 10, 6)}
            </Link>
          </Text>
        </Box>

        <OrderActions order={order} />
      </Flex>
      <Flex column tw="relative w-full h-full pt-0 pb-1">
        <Box tw="absolute w-0.1 h-full left-5 top-0">
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
                      isPrevEvent={true}
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

      {!order.isSeller && order.status === "PLACED" ? (
        <Flex column center tw="w-full gap-1 pb-2">
          <IoTime size="19" tw="text-gray-500" />
          <Text
            size="14"
            weight="bold"
            color="gray500"
            tw="w-2/4"
            align="center"
          >
            Heads up!
            <br />
            The seller hasn&apos;t approved this order yet.
          </Text>
        </Flex>
      ) : null}

      {order.isSeller && order.status === "PLACED" ? (
        <Flex
          center
          column
          tw="py-3 background-image[linear-gradient(0deg, #fff, 85%, #d6fde7)]"
        >
          <FiArrowRightCircle size="21" tw="color[#16C784]" />
          <Box tw="w-2/4 mt-1.5">
            <Text weight="bold" align="center" tw="mb-0.3">
              Good news, new order!
            </Text>

            <Text
              size="14"
              weight="normal"
              align="center"
              tw="color[rgba(0, 0, 0, 0.5)]"
            >
              Your approval is needed for the order to start.
            </Text>
          </Box>
          <Button
            tw="mt-2"
            theme="black"
            text="13"
            onClick={approveOrder}
            isLoading={isApproving}
          >
            Approve order
          </Button>
          <Button
            size="none"
            theme="none"
            tw="underline mt-1 text-gray-600"
            css={{ fontWeight: "normal", fontSize: 13 }}
            onClick={dismissOrder}
            isLoading={isDismissing}
          >
            Dismiss
          </Button>
        </Flex>
      ) : null}

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
        <Box tw="mt-2">
          <OrderMessageBox
            orderId={order.composedId}
            isSeller={order.isSeller}
          />
        </Box>
      )}
    </BaseCard>
  );
};

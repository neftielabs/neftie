import React, { useCallback, useMemo, useRef } from "react";

import { useClickOutside, useToggle } from "@react-hookz/web";
import { IoCaretDown } from "react-icons/io5";
import type { UseMutationResult } from "react-query";
import tw from "twin.macro";

import type { IOrderFull, OrderStatusType } from "@neftie/common";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useOrderActions } from "hooks/contracts/useOrderActions";
import { styled } from "stitches.config";

const Overlay = styled(Box, {
  ...tw`bg-white rounded-12 shadow-lg
  absolute top-full right-0 z-20 transform -translate-y-2.5
  opacity-0 invisible overflow-hidden border border-gray-100`,
  minWidth: 250,
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

type ActionType = {
  title: string;
  trigger: UseMutationResult;
  entity: "seller" | "client" | "both";
};

interface OrderActionsProps {
  order: IOrderFull;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order }) => {
  const [visible, toggleVisible] = useToggle(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => visible && toggleVisible());

  const { approve, dismiss, cancel, deliver, revision } =
    useOrderActions(order);

  const roleFilteredActions = useCallback(
    (actions: ActionType[]) =>
      actions.filter((a) =>
        ["both", order.isSeller ? "seller" : "client"].includes(a.entity)
      ),
    [order.isSeller]
  );

  const allowedActions = useMemo<Record<OrderStatusType, ActionType[]>>(() => {
    const approveAction: ActionType = {
      title: "Approve order",
      trigger: approve,
      entity: "seller",
    };
    const dismissAction: ActionType = {
      title: "Dismiss order",
      trigger: dismiss,
      entity: "both",
    };
    const cancelAction: ActionType = {
      title: "Cancel order",
      trigger: cancel,
      entity: "both",
    };
    const deliverAction: ActionType = {
      title: "Deliver order",
      trigger: deliver,
      entity: "seller",
    };
    const requestRevisionAction: ActionType = {
      title: "Request revision",
      trigger: revision,
      entity: "client",
    };

    return {
      PLACED: roleFilteredActions([approveAction, dismissAction]),
      DISMISSED: [],
      ONGOING: roleFilteredActions([deliverAction, cancelAction]),
      CANCELLED: [],
      DELIVERED: roleFilteredActions([requestRevisionAction]),
      COMPLETED: [],
    };
  }, [approve, cancel, deliver, dismiss, revision, roleFilteredActions]);

  return (
    <Box tw="relative py-1" ref={ref}>
      <Button
        theme="gray"
        size="none"
        tw="px-3 py-1 self-start flex"
        onClick={() => toggleVisible()}
      >
        <Flex center tw="gap-1">
          <Text>Actions</Text>
          <IoCaretDown size="13" />
        </Flex>
      </Button>

      <Overlay visible={visible}>
        {allowedActions[order.status].length === 0 ? (
          <Box tw="py-2 px-2 w-full text-left">
            <Text size="14" color="gray500" weight="bold">
              No actions available
            </Text>
          </Box>
        ) : (
          allowedActions[order.status].map((action) => (
            <Button
              key={action.title}
              theme="none"
              size="none"
              sharp
              tw="py-2 px-2 hover:bg-gray-50 w-full text-left"
              onClick={action.trigger.mutateAsync}
              isLoading={action.trigger.isLoading}
              loader={
                <Loader
                  tw="text-brand-black"
                  svgProps={{ width: 15 }}
                  absoluteCentered
                  active={action.trigger.isLoading}
                />
              }
            >
              <Text weight="bold" color="gray600">
                {action.title}
              </Text>
            </Button>
          ))
        )}
      </Overlay>
    </Box>
  );
};

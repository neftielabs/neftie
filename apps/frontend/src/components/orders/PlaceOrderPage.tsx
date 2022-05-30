import React from "react";

import type { IListingFull } from "@neftie/common";
import { ListingCard } from "components/cards/ListingCard";
import { OrderSummary } from "components/orders/OrderSummary";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";

interface PlaceOrderPageProps {
  listing: IListingFull;
  isTxLoading: boolean;
}

export const PlaceOrderPage: React.FC<PlaceOrderPageProps> = ({
  listing,
  isTxLoading,
}) => {
  return (
    <Box tw="bg-gray-25">
      <Container tw="pt-4 pb-10">
        <Text weight="bold" size="3xl" tw="mb-3">
          Order a service
        </Text>
        <Flex tw="gap-4">
          <Flex tw="flex-basis[60%] self-start">
            <ListingCard tw="w-full" listing={listing} />
          </Flex>
          <Flex tw="flex-basis[40%]">
            <OrderSummary listing={listing} isTxLoading={isTxLoading} />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

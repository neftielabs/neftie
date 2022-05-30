import React from "react";

import type { IListingFull } from "@neftie/common";
import { BaseCard } from "components/cards/BaseCard";
import { EthPrice } from "components/typography/EthPrice";
import { TruncatedText } from "components/typography/TruncatedText";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { useOrderSummary } from "hooks/useOrderSummary";

interface OrderSummaryProps {
  listing: IListingFull;
  isTxLoading: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  listing,
  isTxLoading,
}) => {
  const [{ itemTotal, bondFeeTotal, gasEstimate, orderTotal }] =
    useOrderSummary(listing);

  return (
    <BaseCard as={Flex} column tw="p-3">
      <Text weight="bold" size="lg" tw="mb-1">
        Order summary
      </Text>
      <Text color="gray500" tw="mb-2">
        Here&apos;s the breakdown and cost of the service you&apos;ll be
        ordering
      </Text>
      <Text color="gray500" weight="bold" tw="mb-1">
        Items
      </Text>
      <Flex justifyBetween tw="gap-2 items-start mb-3">
        <Box>
          <TruncatedText weight="bold" text={listing.title} max={30} />
          {/* <Text weight="bold">{listing.title}</Text> */}
          <Text color="gray500" size="13">
            by {listing.seller.user?.username || listing.seller.id}
          </Text>
        </Box>
        <EthPrice price={itemTotal} />
      </Flex>
      <Text color="gray500" weight="bold" tw="mb-1">
        Price
      </Text>
      <Flex justifyBetween tw="gap-2 items-start mb-1">
        <Box>
          <Text>Service</Text>
        </Box>
        <EthPrice price={itemTotal} weight="normal" ethLabel="" />
      </Flex>
      <Flex justifyBetween tw="gap-2 items-start mb-2">
        <Box>
          <Text>Seller bond fee</Text>
        </Box>
        <EthPrice price={bondFeeTotal} weight="normal" ethLabel="" />
      </Flex>
      <Flex justifyBetween tw="gap-2 items-start mb-1">
        <Box>
          <Text>Estimated gas</Text>
        </Box>
        <EthPrice price={`~${gasEstimate}`} weight="normal" ethLabel="" />
      </Flex>
      <Flex justifyBetween tw="gap-2 items-start mb-2">
        <Box>
          <Text weight="bold">Total</Text>
        </Box>
        <Flex column tw="items-end">
          <EthPrice price={orderTotal.eth} />
          <Text size="13" tw="mt-0.3" color="gray500">
            ({orderTotal.usd.formatted})
          </Text>
        </Flex>
      </Flex>

      <Button
        tw="mt-2"
        theme="gradientOrange"
        type="submit"
        isLoading={isTxLoading}
      >
        Place order
      </Button>
    </BaseCard>
  );
};

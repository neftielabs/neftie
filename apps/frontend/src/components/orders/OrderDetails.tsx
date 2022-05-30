import React from "react";

import type { IOrderFull } from "@neftie/common";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { BaseCard } from "components/cards/BaseCard";
import { RatingStars } from "components/rating/RatingStars";
import { EthPrice } from "components/typography/EthPrice";
import { TruncatedText } from "components/typography/TruncatedText";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { routes } from "lib/manifests/routes";
import { getDisplayDays } from "utils/misc";

interface OrderDetailsProps {
  order: IOrderFull;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { listing } = order;

  return (
    <BaseCard tw="flex-basis[30%] p-3 self-start sticky top-3">
      <Text size="md" weight="bold">
        Order details
      </Text>

      <Flex column tw="mt-2">
        <Link
          href={routes.listing(listing.id).index}
          target="_blank"
          tw="mb-1.5"
        >
          <Flex tw="w-full gap-2">
            <Box tw="h-8 rounded-12 overflow-hidden flex-shrink-0 flex-basis[45%]">
              {listing.coverUrl ? (
                <Image src={listing.coverUrl} />
              ) : (
                <ImagePlaceholder />
              )}
            </Box>
            <Flex column tw="mt-0.5 gap-0.5 flex-basis[55%]">
              <TruncatedText
                size="14"
                color="gray600"
                text={listing.title}
                max={30}
              />
              <RatingStars />
            </Flex>
          </Flex>
        </Link>

        <Flex column tw="gap-1 border-t border-gray-100 pt-1.5">
          {(
            [
              ["Delivery days", getDisplayDays(listing.deliveryDays)],
              ["Revisions left", `${order.revisionsLeft}/${listing.revisions}`],
              [
                "Total paid",
                <EthPrice
                  key="p"
                  price={Number(listing.price) + Number(listing.bondFee)}
                />,
              ],
            ] as const
          ).map((e) => (
            <Flex key={e[0]} itemsCenter justifyBetween>
              <Text color="gray600" size="14">
                {e[0]}
              </Text>
              <Text weight="bold">{e[1]}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </BaseCard>
  );
};

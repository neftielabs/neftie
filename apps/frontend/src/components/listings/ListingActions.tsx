import React from "react";

import { HiDotsHorizontal } from "react-icons/hi";
import tw from "twin.macro";

import type { ListingFull } from "@neftie/common";
import { EthPrice } from "components/typography/EthPrice";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { useEthPrice } from "hooks/useEthPrice";
import { routes } from "lib/manifests/routes";

interface ListingActionsProps {
  listing: ListingFull;
}

export const ListingActions: React.FC<ListingActionsProps> = ({ listing }) => {
  const { formattedUsdPrice } = useEthPrice(listing.price);

  return (
    <Flex column tw="flex-basis[35%] sticky top-0">
      <Flex tw="mb-1.5" itemsCenter justifyBetween>
        <Text weight="medium" color="gray500">
          {listing.seller?.user?.username}
        </Text>
        <Button size="none" theme="none" spring tw="hover:bg-gray-100 w-3 h-3">
          <HiDotsHorizontal size="17" tw="mx-auto" />
        </Button>
      </Flex>
      <Text size="2xl" weight="bold" tw="mb-3">
        {listing.title}
      </Text>

      <Flex column tw="bg-gray-25 rounded-12 border border-gray-50 p-2">
        <Text size="13" tw="mb-0.5" color="gray600" weight="medium">
          From
        </Text>
        <Flex tw="gap-1.5">
          <EthPrice
            size="2xl"
            weight="extrabold"
            color="gray800"
            price={listing.price}
            svgProps={{ width: 15 }}
            containerProps={{ css: tw`gap-1` }}
          />
          <Text color="gray600" size="13" css={{ marginTop: 17 }}>
            ({formattedUsdPrice})
          </Text>
        </Flex>
        <Link href={routes.listing(listing.id).order}>
          <Button tw="mt-2 w-full" theme="gradientOrange">
            Place order
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

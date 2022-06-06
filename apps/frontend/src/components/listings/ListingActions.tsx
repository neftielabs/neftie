import React from "react";

import { FiClock, FiRepeat } from "react-icons/fi";
import { HiDotsHorizontal } from "react-icons/hi";
import tw from "twin.macro";

import type { IListingFull } from "@neftie/common";
import { areAddressesEqual } from "@neftie/common";
import { RatingStars } from "components/rating/RatingStars";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { User } from "components/users/User";
import { useAuth } from "hooks/useAuth";
import { useEthPrice } from "hooks/useEthPrice";
import { routes } from "lib/manifests/routes";
import { getDisplayDays } from "utils/misc";

interface ListingActionsProps {
  listing: IListingFull;
}

export const ListingActions: React.FC<ListingActionsProps> = ({ listing }) => {
  const { formattedUsdPrice } = useEthPrice(listing.price);
  const { connectedAddress } = useAuth();

  const isOwnListing =
    connectedAddress && areAddressesEqual(connectedAddress, listing.seller.id);

  return (
    <Box tw="flex-basis[35%] sticky self-start top-2">
      <Flex tw="mb-1" itemsCenter justifyBetween>
        <Text weight="medium" size="14" color="gray400">
          Graphics & Design
        </Text>
        <Button size="none" theme="none" spring tw="hover:bg-gray-100 w-3 h-3">
          <HiDotsHorizontal size="17" tw="mx-auto" />
        </Button>
      </Flex>
      <Text size="2xl" weight="bold" tw="">
        {listing.title}
      </Text>

      <Flex itemsCenter tw="gap-1.5 mt-1.5 mb-2.5">
        <User user={listing.seller} size="sm" textProps={{ color: "black" }} />
        <Box tw="w-0.1 bg-gray-200 h-1.5 mt-0.3" />
        <RatingStars tw="mt-0.1" />
      </Flex>

      <Flex
        column
        tw="bg-gray-25 rounded-12 border border-gray-150 overflow-hidden pb-2"
      >
        <Flex
          column
          tw="bg-white py-1.3 mb-2 gap-1 px-2 border-b border-gray-150"
        >
          <Text size="13" color="gray500" align="center">
            Includes
          </Text>
          <Flex tw="gap-2" justifyCenter>
            <Flex tw="gap-0.7" itemsCenter>
              <FiClock tw="text-gray-900" />
              <Text size="14" weight="medium">
                {getDisplayDays(listing.deliveryDays)} delivery
              </Text>
            </Flex>
            {Number(listing.revisions) > 0 ? (
              <Flex tw="gap-0.7" itemsCenter>
                <FiRepeat tw="text-gray-900" />
                <Text size="14" weight="medium">
                  {listing.revisions} revisions
                </Text>
              </Flex>
            ) : null}
          </Flex>
        </Flex>

        <Box tw="px-2">
          <Text size="13" tw="mb-0.5" color="gray600" weight="medium">
            For just
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
          {isOwnListing ? (
            <Button disabled theme="gray" tw="mt-2 w-full">
              Can&apos;t place order in own listing
            </Button>
          ) : (
            <Link href={routes.listing(listing.id).order}>
              <Button tw="mt-2 w-full" theme="gradientOrange">
                Place order
              </Button>
            </Link>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

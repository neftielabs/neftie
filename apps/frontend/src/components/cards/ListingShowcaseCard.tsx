import React from "react";

import { FiStar } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

import type { IListingFull } from "@neftie/common";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { BaseCard } from "components/cards/BaseCard";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { User } from "components/users/User";
import { routes } from "lib/manifests/routes";

interface ListingShowcaseCardProps {
  listing?: IListingFull;
}

export const ListingShowcaseCard: React.FC<ListingShowcaseCardProps> = ({
  listing,
}) => {
  return (
    <Link
      tw="block w-full"
      {...(listing ? { href: routes.listing(listing.id).index } : {})}
    >
      <BaseCard
        as={Flex}
        column
        tw="w-full shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        <Box tw="h-20 w-full">
          {listing ? (
            <>
              {listing.coverUrl ? (
                <Image src={listing.coverUrl} objectPosition="center" />
              ) : (
                <ImagePlaceholder />
              )}
            </>
          ) : (
            <Skeleton count={1} tw="h-full line-height[1.4]" />
          )}
        </Box>

        <Flex tw="pt-2 pb-1.5" column>
          <Flex
            justifyBetween
            itemsCenter
            tw="border-b border-gray-100 px-3 pb-2"
          >
            <Flex tw="gap-1" itemsCenter>
              <User user={listing?.seller} size="sm" />
            </Flex>

            {listing ? (
              <Flex itemsCenter tw="text-gray-400">
                <FiStar size="14" tw="color[#ffbf00] fill[#ffbf00]" />
                <FiStar size="14" tw="color[#ffbf00] fill[#ffbf00]" />
                <FiStar size="14" tw="color[#ffbf00] fill[#ffbf00]" />
                <FiStar size="14" tw="color[#ffbf00] fill[#ffbf00]" />
                <FiStar size="14" tw="color[#ffbf00] fill[#ffbf00]" />
                <Text size="11" tw="ml-0.5">
                  (232)
                </Text>
              </Flex>
            ) : (
              <Skeleton tw="w-10" />
            )}
          </Flex>
          <Flex column tw="px-3 pb-2">
            <Text size="md" tw="mt-2">
              {listing?.title || <Skeleton />}
            </Text>

            <Flex tw="mt-2.5 justify-between">
              {listing?.price ? (
                <EthPrice
                  size="lg"
                  price={listing.price}
                  svgProps={{ width: 12 }}
                  weight="bolder"
                  containerProps={{ css: tw`gap-0.7` }}
                />
              ) : (
                <Skeleton tw="w-7 h-2" />
              )}
            </Flex>
          </Flex>
        </Flex>
      </BaseCard>
    </Link>
  );
};

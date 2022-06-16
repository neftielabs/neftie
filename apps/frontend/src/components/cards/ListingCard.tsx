import React, { useEffect, useState } from "react";

import { FiStar } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";

import type { IListingFull, IListingPreview } from "@neftie/common";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { BaseCard } from "components/cards/BaseCard";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { User } from "components/users/User";
import { useTypedQuery } from "hooks/http/useTypedQuery";
import { routes } from "lib/manifests/routes";

type ListingCardProps = React.ComponentProps<typeof Link> & {
  listing: IListingFull | IListingPreview | string;
};

export const ListingCard: React.FC<ListingCardProps> = ({
  listing: providedListing,
  ...props
}) => {
  const [listing, setListing] = useState<IListingFull | IListingPreview>();

  const shouldFetch = typeof providedListing === "string";
  const { data: fetchedListing } = useTypedQuery(
    ["getListing", shouldFetch ? providedListing : "noop"],
    {
      enabled: shouldFetch,
    },
    [shouldFetch ? providedListing : "noop"]
  );

  useEffect(() => {
    if (!shouldFetch) {
      setListing(providedListing);
    } else if (fetchedListing) {
      setListing(fetchedListing);
    }
  }, [fetchedListing, providedListing, shouldFetch]);

  return (
    <Link
      href={listing ? routes.listing(listing.id).index : undefined}
      tw="h-full"
      {...props}
    >
      <BaseCard as={Flex} column shadow tw="pb-1.5 h-full gap-1.5">
        <Box tw="h-15 bg-gray-100">
          {listing ? (
            <>
              {listing.coverUrl ? (
                <Image src={listing.coverUrl} />
              ) : (
                <ImagePlaceholder />
              )}
            </>
          ) : (
            <Skeleton count={1} tw="h-full line-height[1.4]" />
          )}
        </Box>

        <Flex column justifyBetween grow tw="px-1.5 gap-1.5">
          <Flex column tw="gap-1.5">
            <User user={listing?.seller} size="xs" />

            <Flex column tw="pr-0.5">
              <Text weight="medium" size="14">
                {listing?.title}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyBetween tw="mt-0.5">
            <Flex itemsCenter tw="gap-0.7">
              {listing?.price ? (
                <EthPrice
                  price={listing.price}
                  size="14"
                  svgProps={{ width: 8 }}
                />
              ) : (
                <Skeleton tw="w-7 h-2" />
              )}
            </Flex>

            <Flex itemsCenter tw="text-gray-600">
              {new Array(5).fill(null).map((_, i) => (
                <FiStar key={i} size="14" strokeWidth={0.9} />
              ))}
              <Text size="11" color="gray500" tw="ml-0.5 mt-0.1">
                (0)
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </BaseCard>
    </Link>
  );
};

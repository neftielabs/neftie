import React from "react";

import { FiStar } from "react-icons/fi";

import type { IListingFull, IListingPreview } from "@neftie/common";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { BaseCard } from "components/cards/BaseCard";
import { Avatar } from "components/media/Avatar";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { routes } from "lib/manifests/routes";

type ListingCardProps = React.ComponentProps<typeof Link> & {
  listing: IListingFull | IListingPreview;
};

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  ...props
}) => {
  return (
    <Link href={routes.listing(listing.id).index} tw="h-full" {...props}>
      <BaseCard as={Flex} column shadow tw="pb-1.5 h-full gap-1.5">
        <Box tw="h-15 bg-gray-100">
          {listing.coverUrl ? (
            <Image src={listing.coverUrl} />
          ) : (
            <ImagePlaceholder />
          )}
        </Box>

        <Flex column justifyBetween grow tw="px-1.5 gap-1.5">
          <Flex column tw="gap-1.5">
            <Flex tw="gap-0.7" itemsCenter>
              <Avatar avatarUrl={listing.seller?.user?.avatarUrl} size="xxs" />
              <Text size="13" weight="medium" color="gray500">
                {listing.seller?.user?.username}
              </Text>
            </Flex>

            <Flex column tw="pr-0.5">
              <Text weight="medium" size="14">
                {listing.title}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyBetween tw="mt-0.5">
            <Flex itemsCenter tw="gap-0.7">
              <EthPrice
                price={listing.price}
                size="14"
                svgProps={{ width: 8 }}
              />
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

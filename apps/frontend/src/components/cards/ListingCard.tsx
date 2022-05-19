import React from "react";

import { FiStar } from "react-icons/fi";

import { EthIcon } from "components/assets/EthIcon";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { Avatar } from "components/media/Avatar";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { routes } from "lib/manifests/routes";

interface ListingCardProps {
  id: string;
  seller?: { avatarUrl?: string | null; username?: string | null };
  title: string;
  price: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  seller,
  title,
  price,
}) => {
  return (
    <Link href={routes.listing(id).index} tw="h-full">
      <Flex
        column
        tw="border border-gray-100 rounded-12 overflow-hidden pb-1.5 hover:shadow-lg transition-all h-full gap-1.5"
      >
        <Box tw="h-15 bg-gray-100">
          <ImagePlaceholder />
        </Box>

        <Flex column justifyBetween grow tw="px-1.5 gap-1.5">
          <Flex column tw="gap-1.5">
            <Flex tw="gap-0.7" itemsCenter>
              <Avatar avatarUrl={seller?.avatarUrl} size="xxs" />
              <Text size="13" weight="medium" color="gray500">
                {seller?.username}
              </Text>
            </Flex>

            <Flex column tw="pr-0.5">
              <Text weight="medium" size="14">
                {title}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyBetween tw="mt-0.5">
            <Flex itemsCenter tw="gap-0.7">
              <EthIcon width="8" />
              <EthPrice label={false} price={price} size="14" />
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
      </Flex>
    </Link>
  );
};

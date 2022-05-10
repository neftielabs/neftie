import { UserSafe, listingSchema } from "@neftie/common";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { Avatar } from "components/media/Avatar";
import { LikePill } from "components/pills/LikePill";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Text } from "components/ui/Text";
import React from "react";
import { FiStar } from "react-icons/fi";
import { noop } from "utils/fp";
import { Asserts } from "yup";

interface ListingPreviewProps {
  user: UserSafe;
  listing:
    | Asserts<typeof listingSchema["createOnChainListing"]>
    | Asserts<typeof listingSchema["createListing"]>;
}

export const ListingPreview: React.FC<ListingPreviewProps> = ({
  user,
  listing,
}) => {
  const isMinimalListing = !("description" in listing);

  return (
    <Flex
      column
      tw="w-full border border-gray-100 rounded-12 overflow-hidden sticky top-3 shadow-xl"
    >
      {!isMinimalListing ? (
        <Box tw="h-15 w-full bg-gray-100">
          {listing.coverUri ? (
            <Image src={listing.coverUri} alt="" />
          ) : (
            <ImagePlaceholder />
          )}
        </Box>
      ) : null}

      <Flex tw="py-2" column>
        <Flex
          justifyBetween
          itemsCenter
          tw="border-b border-gray-100 px-3 pb-2"
        >
          <Flex tw="gap-1" itemsCenter>
            <Avatar avatarUrl={user.avatar.url} size="xs" />
            <Text weight="medium" size="14">
              {user.username}
            </Text>
          </Flex>
          <Flex itemsCenter tw="text-gray-500">
            <FiStar size="14" />
            <FiStar size="14" />
            <FiStar size="14" />
            <FiStar size="14" />
            <FiStar size="14" />
            <Text size="11" tw="ml-0.5">
              (0)
            </Text>
          </Flex>
        </Flex>
        <Flex column tw="px-3">
          <Text size="md" tw="mt-2">
            {listing.title || "I will..."}
          </Text>
          {!isMinimalListing ? (
            <Text size="14" color="gray600" tw="mt-1">
              {listing.description || ""}
            </Text>
          ) : null}

          <Flex tw="mt-2 justify-between" itemsCenter>
            <EthPrice price={listing.price} />
            <Flex>
              <LikePill amount="0" onLike={noop} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

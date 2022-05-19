import React, { useEffect, useState } from "react";

import { FiStar } from "react-icons/fi";
import tw from "twin.macro";

import type { ListingPreview } from "@neftie/common";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { Avatar } from "components/media/Avatar";
import { LikePill } from "components/pills/LikePill";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Text } from "components/ui/Text";
import { useTypedQuery } from "hooks/http/useTypedQuery";
import { useGetUser } from "hooks/queries/useGetUser";
import { noop } from "utils/fp";

type ListingPreviewMinimal = Omit<
  ListingPreview,
  "seller" | "description" | "id" | "coverUrl" | "price"
> & {
  coverUrl?: string | null;
  description?: string | null;
  price: string | number;
};

type ListingPreviewCardProps =
  | {
      listing: ListingPreviewMinimal;
    }
  | {
      address: string;
    };

export const ListingPreviewCard: React.FC<ListingPreviewCardProps> = (
  props
) => {
  const { user } = useGetUser({ currentUser: true });
  const [listing, setListing] = useState<ListingPreviewMinimal>();
  const { data } = useTypedQuery(
    "verifyListingExists",
    {
      enabled: "address" in props,
    },
    "address" in props ? [props.address] : undefined
  );

  useEffect(() => {
    if ("listing" in props) {
      setListing(props.listing);
    } else if ("address" in props && props.address && data) {
      setListing(data);
    }
  }, [data, listing, props]);

  if (!user || !listing) {
    return null;
  }

  return (
    <Flex
      column
      tw="w-full border border-gray-100 rounded-12 overflow-hidden shadow-xl"
      css={"address" in props ? {} : tw`sticky top-3`}
    >
      {listing.coverUrl !== undefined ? (
        <Box tw="h-15 w-full bg-gray-100">
          {listing.coverUrl ? (
            <Image src={listing.coverUrl} alt="" />
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
            <Avatar avatarUrl={user?.avatarUrl} size="xs" />
            <Text weight="medium" size="14">
              {user?.username}
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
          {!listing.description ? (
            <Text size="14" color="gray600" tw="mt-1">
              {listing.description}
            </Text>
          ) : null}

          <Flex tw="mt-2 justify-between" itemsCenter>
            <EthPrice size="lg" price={listing.price} />
            <Flex>
              <LikePill amount="0" onLike={noop} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

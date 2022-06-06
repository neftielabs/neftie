import React, { useEffect, useState } from "react";

import { FiStar } from "react-icons/fi";
import tw from "twin.macro";
import type { Asserts } from "yup";

import type {
  IListingFull,
  IListingPreview,
  listingSchema,
} from "@neftie/common";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { LikePill } from "components/pills/LikePill";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Text } from "components/ui/Text";
import { User } from "components/users/User";
import { useTypedQuery } from "hooks/http/useTypedQuery";
import { useGetUser } from "hooks/queries/useGetUser";
import { noop } from "utils/fp";

type ListingPreviewMinimal = Omit<
  IListingPreview,
  "seller" | "description" | "id" | "coverUrl" | "price"
> & {
  coverUrl?: string | null;
  description?: string | null;
  price: string | number;
};

type ListingType =
  | ListingPreviewMinimal
  | IListingFull
  | Asserts<typeof listingSchema["editListing"]>;

type ListingPreviewCardProps =
  | {
      listing: ListingType;
    }
  | {
      address: string;
    };

export const ListingPreviewCard: React.FC<ListingPreviewCardProps> = (
  props
) => {
  const isFetchedAddress = "address" in props;

  const { data: user } = useGetUser({ from: { currentUser: true } });
  const [listing, setListing] = useState<ListingType>();
  const { data } = useTypedQuery(
    "verifyListingExists",
    {
      enabled: isFetchedAddress,
    },
    isFetchedAddress ? [props.address] : undefined
  );

  useEffect(() => {
    if (!isFetchedAddress) {
      setListing(props.listing);
    } else if (isFetchedAddress && props.address && data) {
      setListing(data);
    }
  }, [data, isFetchedAddress, listing, props]);

  if (!user || !listing) {
    return null;
  }

  return (
    <Flex
      column
      tw="w-full border border-gray-100 rounded-12 overflow-hidden shadow-xl bg-white"
      css={"address" in props ? {} : tw`sticky top-3`}
    >
      <Box tw="h-15 w-full bg-gray-100">
        {listing.coverUrl ? (
          <Image src={listing.coverUrl} alt="" />
        ) : (
          <ImagePlaceholder />
        )}
      </Box>

      <Flex tw="py-2" column>
        <Flex
          justifyBetween
          itemsCenter
          tw="border-b border-gray-100 px-3 pb-2"
        >
          <User user={user} size="sm" />
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

          <Flex tw="mt-2 justify-between" itemsCenter>
            <EthPrice
              size="lg"
              price={listing.price}
              svgProps={{ width: 10 }}
              weight="bold"
              containerProps={{ css: tw`gap-1` }}
            />
            <Flex>
              <LikePill amount="0" onLike={noop} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

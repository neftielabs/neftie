import React, { useEffect, useRef } from "react";

import { useIntersectionObserver } from "@react-hookz/web";
import tw from "twin.macro";

import { ListingCard } from "components/cards/ListingCard";
import { Box } from "components/ui/Box";
import { Grid } from "components/ui/Grid";
import { Loader } from "components/ui/Loader";
import { useTypedInfQuery } from "hooks/http/useTypedInfQuery";

interface ProfileListingsProps {
  sellerAddress: string;
}

export const ProfileListings: React.FC<ProfileListingsProps> = ({
  sellerAddress,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersectionObserver(elementRef);

  const {
    data: listings,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTypedInfQuery(
    "getSellerListings",
    {
      getNextPageParam: (lastPage) => lastPage.meta?.cursor,
    },
    { sellerAddress }
  );

  useEffect(() => {
    const isInFetchRange = !!intersection?.isIntersecting;

    if (isInFetchRange && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    intersection?.isIntersecting,
    isFetchingNextPage,
  ]);

  return (
    <>
      <Grid tw="grid-cols-4 gap-2" css={listings ? {} : tw`h-30`}>
        {listings?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </React.Fragment>
        ))}
      </Grid>

      <Box ref={elementRef} tw="w-full py-4">
        {isFetchingNextPage ? <Loader centered /> : null}
      </Box>
    </>
  );
};
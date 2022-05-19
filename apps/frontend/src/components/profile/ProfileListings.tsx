import React, { useEffect, useRef } from "react";

import { useIntersectionObserver } from "@react-hookz/web";
import { ListingCard } from "components/cards/ListingCard";
import { Box } from "components/ui/Box";
import { Grid } from "components/ui/Grid";
import { Loader } from "components/ui/Loader";
import { useTypedInfQuery } from "hooks/http/useTypedInfQuery";
import tw from "twin.macro";

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
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                seller={{
                  avatarUrl: listing.seller.user?.avatarUrl,
                  username: listing.seller.user?.username,
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </Grid>

      <Box ref={elementRef} tw="w-full py-4">
        {isFetchingNextPage ? <Loader centered /> : null}
      </Box>

      {/* {guard<boolean, JSX.Element | null>([
        [() => isFetchingNextPage, () => <Loader centered />],
        [
          () => !!hasNextPage,
          () => (
            <Button tw="mt-3 mx-auto" onClick={() => fetchNextPage()}>
              Load more
            </Button>
          ),
        ],
      ])(() => null)(constTrue())} */}
    </>
  );
};

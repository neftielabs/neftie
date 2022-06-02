import React, { useEffect, useRef } from "react";

import { useIntersectionObserver } from "@react-hookz/web";
import tw from "twin.macro";

import { areAddressesEqual } from "@neftie/common";
import { NotFoundNotice } from "components/alerts/NotFoundNotice";
import { ListingCard } from "components/cards/ListingCard";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Grid } from "components/ui/Grid";
import { Link } from "components/ui/Link";
import { Loader } from "components/ui/Loader";
import { useTypedInfQuery } from "hooks/http/useTypedInfQuery";
import { useAuth } from "hooks/useAuth";
import { routes } from "lib/manifests/routes";
import { hasPaginatedItems } from "utils/misc";

interface ProfileListingsProps {
  sellerAddress: string;
}

export const ProfileListings: React.FC<ProfileListingsProps> = ({
  sellerAddress,
}) => {
  const { connectedAddress } = useAuth();

  const elementRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersectionObserver(elementRef);

  const {
    data: listings,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTypedInfQuery(
    ["getSellerListings", sellerAddress],
    {
      getNextPageParam: (lastPage) => lastPage.meta?.cursor,
    },
    { sellerId: sellerAddress }
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
      {!hasPaginatedItems(listings) ? (
        <NotFoundNotice
          action={
            areAddressesEqual(connectedAddress, sellerAddress) ? (
              <Link href={routes.create}>
                <Button tw="mt-2" theme="gray">
                  Start selling
                </Button>
              </Link>
            ) : undefined
          }
        >
          No listings were found
        </NotFoundNotice>
      ) : (
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
      )}
    </>
  );
};

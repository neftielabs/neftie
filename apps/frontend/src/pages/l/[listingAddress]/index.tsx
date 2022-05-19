import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import tw from "twin.macro";

import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { Page } from "components/Page";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useTypedQuery } from "hooks/http/useTypedQuery";
import { useEthPrice } from "hooks/useEthPrice";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

interface ListingPageProps {}

const ListingPage: PageComponent<ListingPageProps> = () => {
  const { query, push } = useRouter();
  const [listingAddress, setListingAddress] = useState("");

  const { data: listing, isError } = useTypedQuery(
    "getListing",
    {
      enabled: !!listingAddress,
    },
    [listingAddress]
  );

  const ethPrice = useEthPrice();

  useEffect(() => {
    if (query.listingAddress && typeof query.listingAddress === "string") {
      setListingAddress(query.listingAddress);
    }
  }, [query.listingAddress]);

  if (isError) {
    push(routes.notFound);
  }

  return (
    <Page title={"listing"}>
      <Container tw="py-5 relative">
        {listing ? (
          <Flex tw="gap-4">
            <Flex tw="w-full gap-4 flex-basis[70%]" column>
              <Text size="2xl" weight="bold">
                {listing.title}
              </Text>
              <Box tw="h-40 w-full rounded-12 overflow-hidden">
                <ImagePlaceholder />
              </Box>
            </Flex>
            <Flex column tw="flex-basis[30%]">
              <Flex
                itemsCenter
                tw="bg-gray-25 rounded-12 border border-gray-50 px-2 py-1 gap-2"
              >
                <EthPrice
                  size="2xl"
                  weight="extrabold"
                  color="gray800"
                  price={listing.price}
                  svgProps={{ width: 15 }}
                  containerProps={{ css: tw`gap-1` }}
                />
                <Text>{ethPrice}</Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Box tw="py-20">
            <Loader absoluteCentered />
          </Box>
        )}
      </Container>
      <pre>
        {ethPrice}
        {JSON.stringify(listing, null, 2)}
      </pre>
    </Page>
  );
};

export default ListingPage;

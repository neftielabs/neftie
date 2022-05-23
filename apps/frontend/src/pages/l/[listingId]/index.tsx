import React from "react";

import { useRouter } from "next/router";

import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { ListingActions } from "components/listings/ListingActions";
import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useGetListingFromQuery } from "hooks/useGetListingFromQuery";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

interface ListingPageProps {}

const ListingPage: PageComponent<ListingPageProps> = () => {
  const { push } = useRouter();
  const { data: listing, isError } = useGetListingFromQuery();

  if (isError) {
    push(routes.notFound);
  }

  return (
    <Page title={"listing"}>
      <Container tw="py-4">
        {listing ? (
          <Flex tw="gap-4">
            <Flex tw="w-full gap-4 flex-basis[65%]" column>
              <Box tw="h-40 w-full rounded-12 overflow-hidden">
                {listing.coverUrl ? (
                  <Image src={listing.coverUrl} />
                ) : (
                  <ImagePlaceholder />
                )}
              </Box>
              <Flex column tw="gap-0.3">
                <Text size="lg" weight="bold" tw="mb-2">
                  About the service
                </Text>
                {listing.description?.split("\n").map((d, i) => (
                  <Text key={i}>{d}</Text>
                ))}
              </Flex>
            </Flex>
            <ListingActions listing={listing} />
          </Flex>
        ) : (
          <Loader centered tw="py-20" />
        )}
      </Container>
      <pre>{JSON.stringify(listing, null, 2)}</pre>
    </Page>
  );
};

export default ListingPage;

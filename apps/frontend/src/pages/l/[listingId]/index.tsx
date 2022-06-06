import React from "react";

import { useRouter } from "next/router";

import { areAddressesEqual } from "@neftie/common";
import { EtherscanLogo } from "components/assets/EtherscanLogo";
import { ImagePlaceholder } from "components/assets/ImagePlaceholder";
import { EditorRenderer } from "components/forms/rich-editor/EditorRenderer";
import { ListingActions } from "components/listings/ListingActions";
import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Link } from "components/ui/Link";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useAuth } from "hooks/useAuth";
import { useGetListingFromQuery } from "hooks/useGetListingFromQuery";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";
import { getEtherscanLink } from "utils/web3";

interface ListingPageProps {}

const ListingPage: PageComponent<ListingPageProps> = () => {
  const { push } = useRouter();
  const { data: listing, isError } = useGetListingFromQuery();
  const { connectedAddress } = useAuth();

  if (isError) {
    push(routes.notFound);
  }

  if (!listing) {
    return <Loader centered tw="py-20" />;
  }

  return (
    <Page title={"listing"}>
      <Container tw="pt-4 pb-10">
        <Flex tw="gap-4">
          <Flex tw="w-full gap-4 flex-basis[65%]" column>
            <Box tw="h-40 w-full rounded-12 overflow-hidden">
              {listing.coverUrl ? (
                <Image src={listing.coverUrl} />
              ) : (
                <ImagePlaceholder />
              )}
            </Box>

            <Flex column>
              <Flex justifyBetween tw="mb-2 items-start">
                <Text size="lg" weight="bold">
                  About the service
                </Text>

                {areAddressesEqual(connectedAddress, listing.seller.id) ? (
                  <Link href={routes.listing(listing.id).edit}>
                    <Button size="sm" theme="gray" tw="-mt-1">
                      Edit listing
                    </Button>
                  </Link>
                ) : null}
              </Flex>

              <Box tw="word-break[break-word]">
                <EditorRenderer
                  rawContent={listing.description}
                  fallback={
                    <Text color="gray400" tw="italic">
                      No description available
                    </Text>
                  }
                />
              </Box>

              <Text size="lg" weight="bold" tw="mt-6">
                Details
              </Text>
              <Flex column tw="mt-2">
                <Link
                  href={getEtherscanLink({ address: listing.id })}
                  rel="noreferrer"
                  target="_blank"
                  variant="dimToBlack"
                >
                  <Flex tw="gap-1.3">
                    <EtherscanLogo width="20" />
                    <Text weight="medium">View on Etherscan</Text>
                  </Flex>
                </Link>
              </Flex>

              <Text size="lg" weight="bold" tw="mt-6">
                Reviews (0)
              </Text>
              <Text color="gray400" tw="italic mt-2">
                No reviews yet
              </Text>
            </Flex>
          </Flex>

          <ListingActions listing={listing} />
        </Flex>
      </Container>
    </Page>
  );
};

export default ListingPage;

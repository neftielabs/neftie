import React from "react";

import { ListingCard } from "components/cards/ListingCard";
import { ListingShowcaseCard } from "components/cards/ListingShowcaseCard";
import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { useTypedQuery } from "hooks/http/useTypedQuery";
import {
  HOME_FEATURED_LISTING,
  HOME_TRENDING_LISTINGS,
} from "lib/constants/app";
import type { PageComponent } from "types/tsx";

interface HomePageProps {}

const HomePage: PageComponent<HomePageProps> = () => {
  const { data: featured } = useTypedQuery(
    ["getListing", HOME_FEATURED_LISTING],
    {},
    [HOME_FEATURED_LISTING]
  );

  return (
    <Page>
      <Box tw="pb-20">
        <Box tw="py-10 relative bg-white">
          <Box
            tw="absolute top-0 left-0 w-full h-full opacity[0.17] z-index[0]"
            css={{
              background: `url(${featured?.coverUrl}) no-repeat center/cover`,
              filter: "blur(15px)",
              mask: "linear-gradient(180deg, #FFF, 80%, transparent)",
            }}
          />
          <Container tw="z-10 relative">
            <Container>
              <Flex justifyBetween tw="gap-6">
                <Box tw="flex-basis[57%]">
                  <Text weight="bolder" css={{ fontSize: 45, lineHeight: 1.2 }}>
                    Freelancing like you&apos;ve never seen it before.
                  </Text>
                  <Text tw="mt-1.5 w-3/4" size="lg" color="gray700">
                    Discover outstanding professionals or start promoting your
                    services, on-chain.{" "}
                    <Text
                      as="span"
                      color="white"
                      tw="rounded-full px-1 py-0.3 font-size[11px] vertical-align[middle]"
                      weight="bold"
                      css={{
                        backgroundImage:
                          "linear-gradient(100deg, #FF0F7B, #F89B29)",
                      }}
                    >
                      beta
                    </Text>
                  </Text>
                  <Button tw="mt-2.5">Learn more</Button>
                </Box>
                <Box tw="flex-basis[43%]">
                  <ListingShowcaseCard listing={featured} />
                </Box>
              </Flex>
            </Container>
          </Container>
        </Box>
        <Container>
          <Flex column itemsCenter tw="mt-10 relative z-10 w-full">
            <Text weight="bold" size="xl">
              Trending right now
            </Text>
            <Flex center tw="w-full mt-3">
              <ListingCard
                tw="flex-basis[30%] scale-90"
                listing={HOME_TRENDING_LISTINGS[0]}
              />
              <ListingCard
                tw="flex-basis[40%]"
                listing={HOME_TRENDING_LISTINGS[1]}
              />
              <ListingCard
                tw="flex-basis[30%] scale-90"
                listing={HOME_TRENDING_LISTINGS[2]}
              />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Page>
  );
};

export default HomePage;

import React from "react";

import { ListingShowcaseCard } from "components/cards/ListingShowcaseCard";
import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { useTypedQuery } from "hooks/http/useTypedQuery";
import type { PageComponent } from "types/tsx";

interface HomePageProps {}

const HomePage: PageComponent<HomePageProps> = () => {
  const featured = "0xc0e17754cfac313cf784381b42ff372853cd9d8f";

  const { data } = useTypedQuery(["getListing", featured], {}, [featured]);

  return (
    <Page>
      <Box tw="pb-20">
        <Box tw="py-10 relative bg-white">
          <Box
            tw="absolute top-0 left-0 w-full h-full opacity[0.17] z-index[0]"
            css={{
              background: `url(${data?.coverUrl}) no-repeat center/cover`,
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
                  <ListingShowcaseCard listing={data} />
                </Box>
              </Flex>
            </Container>
          </Container>
        </Box>
      </Box>
    </Page>
  );
};

export default HomePage;

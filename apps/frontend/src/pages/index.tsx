import React from "react";

import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Image } from "components/ui/Image";
import { Text } from "components/ui/Text";
import { useToastStore } from "stores/useToastStore";
import type { PageComponent } from "types/tsx";

interface HomePageProps {}

const HomePage: PageComponent<HomePageProps> = () => {
  const { showToast } = useToastStore();

  return (
    <Page>
      <Box tw="py-20">
        <Container as={Flex} justifyBetween>
          <Text
            size="3xl"
            weight="medium"
            onClick={() =>
              showToast({
                message: "Waiting for the transaction confirmation",
                isLoading: true,
              })
            }
          >
            Discover talented digital artists
          </Text>
          <Box tw="mr-6">
            <Flex
              column
              tw="rounded-12 overflow-hidden h-40 w-40 border border-gray-100 shadow-lg"
            >
              <Box tw="w-full h-full bg-gray-100 relative">
                <Image src="https://i.imgur.com/ifpzELr.jpeg" alt="" />
              </Box>
              <Box tw="px-1.5 py-2">@loremipsum</Box>
            </Flex>
          </Box>
        </Container>
      </Box>
      {/* <Box tw="mt-3 mb-10 container">
        <Box tw="rounded-12 h-40 relative overflow-hidden bg-black p-7">
          <Box
            tw="absolute right-1 top-1 px-1 py-0.5 text-white rounded-md font-bold text-sm z-50"
            css={{ background: "rgba(255, 255, 255, 0.4)" }}
          >
            Featured seller
          </Box>
          <Text color="white" weight="bold" size="3xl" tw="relative z-30">
            Find the talent you&apos;re looking for
          </Text>

        </Box>
        <Box tw="mt-5">
          <Text weight="bolder" size="xl" color="gray800">
            Hot right now
          </Text>
          <Flex justifyBetween tw="mt-2">
            <Flex column tw="rounded-12 border border-gray-150 overflow-hidden">
              <Box tw="relative w-full h-10">

              </Box>
              <Box tw="px-2 mt-2">
                <Text align="left" weight="bold">
                  Premium custom NFT design
                </Text>
                <Text>3 eth</Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box> */}
    </Page>
  );
};

export default HomePage;

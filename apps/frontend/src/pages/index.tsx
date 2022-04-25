import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import Image from "next/image";
import React from "react";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <Page>
      <Box tw="mt-3 mb-10 container">
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
          <Image
            css={{ zIndex: 0, opacity: 0.7 }}
            src="/_ign_plh/nft.jpg"
            alt=""
            layout="fill"
            objectFit="cover"
          />
        </Box>
        <Box tw="mt-5">
          <Text weight="bolder" size="xl" color="gray800">
            Hot right now
          </Text>
          <Flex justifyBetween tw="mt-2">
            <Flex column tw="rounded-12 border border-gray-150 overflow-hidden">
              <Box tw="relative w-full h-10">
                <Image
                  src="/_ign_plh/nft.jpg"
                  layout="fill"
                  objectFit="cover"
                  alt=""
                />
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
      </Box>
    </Page>
  );
};

export default HomePage;

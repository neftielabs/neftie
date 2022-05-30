import React, { useState } from "react";

import type { UserSafe } from "@neftie/common";
import { ProfileListings } from "components/profile/ProfileListings";
import { TabItem } from "components/tabs/TabItem";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";

interface ProfileTabsProps {
  user: UserSafe;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);

  const [isHovering, setIsHovering] = useState(false);
  const [indicatorParams, setIndicatorParams] = useState({
    width: 100,
    x: 0,
  });

  const tabs = [
    {
      title: "Listings",
      component: <ProfileListings sellerAddress={user.id} />,
    },
    {
      title: "About",
      component: <></>,
    },
    {
      title: "Work",
      component: <></>,
    },
    {
      title: "Reviews",
      component: <></>,
    },
  ];

  return (
    <Container tw="mb-10">
      <Flex
        justifyBetween
        tw="max-width[400px] relative mb-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Box
          tw="absolute bg-gray-25 rounded-12 px-2 py-2 transition-all top-1/2"
          css={{
            zIndex: -1,
            opacity: isHovering ? 1 : 0,
            width: indicatorParams.width,
            transform: `translate(${indicatorParams.x}px, -50%)`,
          }}
        />
        {tabs.map((tab, i) => (
          <TabItem
            key={tab.title}
            active={i === currentTabIdx}
            setIndicatorParams={setIndicatorParams}
            onClick={() => setCurrentTabIdx(i)}
          >
            {tab.title}
          </TabItem>
        ))}
      </Flex>

      {tabs.find((_, i) => i === currentTabIdx)?.component}
    </Container>
  );
};

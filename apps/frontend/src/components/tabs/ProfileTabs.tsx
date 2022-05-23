import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import type { UserSafe } from "@neftie/common";
import { ProfileListings } from "components/profile/ProfileListings";
import { TabItem } from "components/tabs/TabItem";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { routes } from "lib/manifests/routes";
import type { ProfileTabs as ProfileTabsType } from "types/ui";

interface ProfileTabsProps {
  user: UserSafe;
  currentTab: ProfileTabsType;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  user,
  currentTab,
}) => {
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const { push } = useRouter();

  const [isHovering, setIsHovering] = useState(false);
  const [indicatorParams, setIndicatorParams] = useState({
    width: 100,
    x: 0,
  });

  const tabs = useMemo(() => {
    const username = user.username || user.address;
    const route = routes.user(username);

    return [
      {
        title: "Listings",
        route: route.listings,
        component: <ProfileListings sellerAddress={user.address} />,
      },
      {
        title: "About",
        route: route.about,
        component: <></>,
      },
      {
        title: "Work",
        route: route.work,
        component: <></>,
      },
      {
        title: "Reviews",
        route: route.reviews,
        component: <></>,
      },
    ];
  }, [user.address, user.username]);

  useEffect(() => {
    if (!currentTab) return;

    const tabIdx = tabs.findIndex((t) => t.title.toLowerCase() === currentTab);
    if (tabIdx !== -1) {
      setCurrentTabIdx(tabIdx);
    }
  }, [currentTab, tabs]);

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
            key={tab.route}
            active={i === currentTabIdx}
            setIndicatorParams={setIndicatorParams}
            onClick={() => push(tab.route, undefined, { shallow: true })}
          >
            {tab.title}
          </TabItem>
        ))}
      </Flex>

      {tabs.find((_, i) => i === currentTabIdx)?.component}
    </Container>
  );
};

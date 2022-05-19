import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";

import type { UserSafe } from "@neftie/common";
import { ProfileListings } from "components/profile/ProfileListings";
import { TabItem } from "components/tabs/TabItem";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { useRedirectProfile } from "hooks/useRedirectProfile";
import { routes } from "lib/manifests/routes";
import { ProfileTab } from "types/ui";

interface ProfileTabsProps {
  user: UserSafe;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const { getCurrentTab } = useRedirectProfile(user);
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
        title: ProfileTab.listings,
        route: route.listings,
        component: <ProfileListings sellerAddress={user.address} />,
      },
      {
        title: ProfileTab.about,
        route: route.about,
        component: <></>,
      },
      {
        title: ProfileTab.work,
        route: route.work,
        component: <></>,
      },
      {
        title: ProfileTab.reviews,
        route: route.reviews,
        component: <></>,
      },
    ];
  }, [user.address, user.username]);

  useEffect(() => {
    const currentTab = getCurrentTab();
    if (!currentTab) return;

    const tabIdx = tabs.findIndex((t) => t.title.toLowerCase() === currentTab);
    if (tabIdx !== -1) {
      setCurrentTabIdx(tabIdx);
    }
  }, [getCurrentTab, tabs]);

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

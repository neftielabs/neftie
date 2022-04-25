import { UserSafe } from "@neftie/common";
import { TabItem } from "components/tabs/TabItem";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { useRedirectProfile } from "hooks/useRedirectProfile";
import { routes } from "lib/manifests/routes";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { ProfileTab } from "types/ui";

interface ProfileTabsProps {
  user: UserSafe;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
  const { getCurrentTab } = useRedirectProfile(user);
  const [currentTabIdx, setCurrentTabIdx] = useState(0);
  const { push } = useRouter();
  const [indicatorParams, setIndicatorParams] = useState({
    width: 100,
    x: 0,
  });

  const tabs = useMemo(() => {
    const username = user.username || user.address;
    const route = routes.user(username);

    return [
      {
        title: ProfileTab.work,
        route: route.work,
      },
      {
        title: ProfileTab.about,
        route: route.about,
      },
      {
        title: ProfileTab.reviews,
        route: route.reviews,
      },
      {
        title: ProfileTab.services,
        route: route.services,
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
      <Flex justifyBetween tw="max-width[400px]">
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
    </Container>
  );
};

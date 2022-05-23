import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";

import type { UserSafe } from "@neftie/common";
import { routes } from "lib/manifests/routes";
import type { ProfileTabs } from "types/ui";
import { allowedProfileTabs } from "types/ui";

export const useRedirectProfile = (user?: UserSafe | null) => {
  const { query, replace } = useRouter();
  const [currentTab, setCurrentTab] = useState<ProfileTabs>("listings");

  const isTabAllowed = useCallback((tab: string): tab is ProfileTabs => {
    return allowedProfileTabs.includes(tab as any);
  }, []);

  /**
   * Parse query params and determine which
   * tab should be displayed
   */
  useEffect(() => {
    const queryTab = !!query.tab && Array.isArray(query.tab) && query.tab[0];

    if (queryTab === currentTab) {
      return;
    }

    if (queryTab && isTabAllowed(queryTab)) {
      setCurrentTab(queryTab);
    } else {
      setCurrentTab("listings");
    }
  }, [currentTab, isTabAllowed, query.tab, query.username, replace]);

  /**
   * Redirect to the current tab and username
   */
  useEffect(() => {
    if (query.username && typeof query.username === "string") {
      const username = user?.username || query.username;

      if (username === query.username) {
        return;
      }

      replace(routes.user(username)[currentTab]);
    }
  }, [currentTab, query.username, replace, user?.username]);

  return currentTab;
};

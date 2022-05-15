import { UserSafe, isValidAddress } from "@neftie/common";
import { routes } from "lib/manifests/routes";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { ProfileTab } from "types/ui";
import { everyTrue } from "utils/fp";

export const useRedirectProfile = (user: UserSafe) => {
  const { query, replace } = useRouter();

  const getCurrentTab = useCallback(() => {
    return query.tab && query.tab.length === 1 && query.tab[0] in ProfileTab
      ? query.tab[0]
      : null;
  }, [query.tab]);

  const tabRedirect = useCallback(
    (username: string) => {
      if (!username) return;

      const currentTab = getCurrentTab();

      if (!currentTab) {
        // Redirect to default tab
        replace(routes.user(username).listings, undefined, { shallow: true });
        return;
      }

      if (username !== query.username) {
        // Redirect to same tab only changing the username path
        replace(
          routes.user(username)[
            currentTab as keyof ReturnType<typeof routes["user"]>
          ],
          undefined,
          { shallow: true }
        );
      }
    },
    [getCurrentTab, query.username, replace]
  );

  useEffect(() => {
    if (everyTrue([isValidAddress(String(query.username)), !!user.username])) {
      tabRedirect(user.username);
    } else {
      tabRedirect(String(query.username));
    }
  }, [query.username, tabRedirect, user.username]);

  return { getCurrentTab };
};

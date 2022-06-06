import type { InfiniteData } from "react-query";

import type { MergedUser, Paginated, UserSafe } from "@neftie/common";
import { isServer } from "utils/app";
import { shortenAddress } from "utils/web3";

export const hasPaginatedItems = (
  e: InfiniteData<Paginated<any[]>> | undefined
) => e?.pages[0].items.length !== 0;

/**
 * Return either a username or address if
 * the user isn't present
 */
export const getDisplayName = (user: MergedUser) =>
  user.user?.username ?? shortenAddress(user.id);

/**
 * From a user, get an identifier such as the username
 * or fall back to the address if not available
 */
export const usernameOrId = (user: UserSafe | MergedUser) => {
  if ("username" in user && !!user.username) {
    return user.username;
  }

  if ("user" in user && !!user.user?.username) {
    return user.user.username;
  }

  return user.id;
};

/**
 * Return a formatted value + day(s)
 */
export const getDisplayDays = (value: string | number) =>
  `${value} day${Number(value) === 1 ? "" : "s"}`;

/**
 * Toggle scroll/no-scroll modes
 */
export const setPageScrollable = (scroll: boolean) => {
  if (isServer) return;

  if (scroll) {
    window.document.body.classList.remove("no-scroll");
    window.document.documentElement.classList.remove("no-scroll");
  } else {
    window.document.body.classList.add("no-scroll");
    window.document.documentElement.classList.add("no-scroll");
  }
};

import type { InfiniteData } from "react-query";

import type { MergedUser, Paginated } from "@neftie/common";
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
 * Return a formatted value + day(s)
 */
export const getDisplayDays = (value: string | number) =>
  `${value} day${Number(value) === 1 ? "" : "s"}`;

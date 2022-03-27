import { UserSafe } from "@neftie/common";
import { useUserStore } from "stores/useUserStore";

export const useUser = () => {
  const [user, isLoading] = useUserStore((s) => [
    s.user,
    s.isFetchingUser || !s.hasFetchedUser,
  ]);

  return [user, isLoading] as [UserSafe | null, boolean];
};

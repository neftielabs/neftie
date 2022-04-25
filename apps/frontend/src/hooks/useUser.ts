import { UserSafe } from "@neftie/common";
import { useUserStore } from "stores/useUserStore";
import { useConnect } from "wagmi";

export const useUser = () => {
  const [
    {
      data: { connected },
    },
  ] = useConnect();
  const [user, isFetching, hasFetched] = useUserStore((s) => [
    s.user,
    s.isFetchingUser,
    s.hasFetchedUser,
  ]);

  const isLoading = isFetching || (!hasFetched && connected);

  return [user, isLoading] as [UserSafe | null, boolean];
};

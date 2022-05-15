import { UserSafe } from "@neftie/common";
import { useTypedQuery } from "hooks/http/useTypedQuery";
import { UseQueryOptions } from "react-query";
import { useAccount } from "wagmi";

type UseGetUserReturn = { user: UserSafe | undefined; isLoading: boolean };
type QueryOptions = UseQueryOptions & { currentUser: true };

export function useGetUser(opts: QueryOptions): UseGetUserReturn;
export function useGetUser(
  address: string | undefined,
  opts?: UseQueryOptions
): UseGetUserReturn;
export function useGetUser(
  addressOrOpts: string | undefined | QueryOptions,
  opts?: UseQueryOptions | undefined
): UseGetUserReturn {
  const [{ data: accountData }] = useAccount();

  let queryAddress: string | undefined = undefined;

  if (typeof addressOrOpts === "string") {
    queryAddress = addressOrOpts;
  } else if (addressOrOpts?.currentUser) {
    queryAddress = accountData?.address;
  }

  const { data: userData, isLoading } = useTypedQuery(
    "getUser",
    {
      enabled: !!queryAddress,
      ...opts,
    },
    [queryAddress || ""]
  );

  return { user: userData?.user, isLoading };
}

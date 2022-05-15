import { TokenObject, useTokenStore } from "stores/useTokenStore";

export const useToken = (): [
  TokenObject | null,
  { setToken: (t: TokenObject | null) => void }
] => {
  return useTokenStore(({ token, setToken }) => [token, { setToken }]);
};

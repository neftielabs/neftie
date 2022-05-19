import type { Call } from "../types";

export const toolsMethods = (call: Call) => ({
  mutation: {},
  query: {
    getEthPrice: () => call("/tools/eth", "get"),
  },
});

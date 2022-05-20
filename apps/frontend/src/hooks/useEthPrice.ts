import { useTypedQuery } from "hooks/http/useTypedQuery";

export const useEthPrice = (convertFrom: number | string = 1) => {
  const { data } = useTypedQuery("getEthPrice", {
    staleTime: 60 * 5 * 1000, // 5 minutes
  });

  if (!data) {
    return;
  }

  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.ethUsdPrice * Number(convertFrom))}`;
};

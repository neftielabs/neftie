import { useTypedQuery } from "hooks/http/useTypedQuery";

export const useEthPrice = (convertFrom: number | string = 1) => {
  const { data, isError } = useTypedQuery("getEthPrice", {
    // staleTime: 60 * 5 * 1000, // 5 minutes
  });

  if (!data || isError) {
    return {
      usdPrice: 0,
      formattedUsdPrice: "$0.00",
    };
  }

  const price = data.ethUsdPrice * Number(convertFrom);

  return {
    usdPrice: price,
    formattedUsdPrice: `${new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)}`,
  };
};

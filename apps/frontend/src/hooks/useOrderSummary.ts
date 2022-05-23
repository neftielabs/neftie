import { useEffect, useState } from "react";

import { ethers } from "ethers";
import { useFeeData, useProvider, useSigner } from "wagmi";

import type { ListingFull } from "@neftie/common";
import { number } from "@neftie/common";
import { useAuth } from "hooks/useAuth";
import { useEthPrice } from "hooks/useEthPrice";
import { getListingContract } from "lib/web3/contracts";
import { noop } from "utils/fp";

export const useOrderSummary = (listing: ListingFull) => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { isAuthed } = useAuth();

  const { usdPrice, formattedUsdPrice } = useEthPrice(
    Number(listing.price) + Number(listing.bondFee)
  );

  const [totals, setTotals] = useState({
    itemTotal: listing.price,
    bondFeeTotal: listing.bondFee,
    gasEstimate: "0",
    orderTotal: {
      eth: "0",
      usd: {
        value: "0",
        formatted: "0",
      },
    },
  });

  const { data: feeData } = useFeeData({
    cacheTime: 2_000,
    staleTime: Infinity,
  });

  useEffect(() => {
    setTotals((t) => ({
      ...t,
      orderTotal: {
        eth: number.limitDecimals(
          Number(listing.price) + Number(listing.bondFee),
          6
        ),
        usd: {
          value: number.limitDecimals(usdPrice, 6),
          formatted: formattedUsdPrice,
        },
      },
    }));
  }, [formattedUsdPrice, listing.bondFee, listing.price, usdPrice]);

  useEffect(() => {
    if (!signer || !isAuthed || !feeData || !feeData.gasPrice) return;

    const price = ethers.utils.parseEther(totals.itemTotal);
    const bondFee = ethers.utils.parseEther(totals.bondFeeTotal);

    const contract = getListingContract(signer, listing.id);

    contract.estimateGas
      .placeOrder({
        value: price.add(bondFee),
      })
      .then((gasUnits) => {
        const formattedGas = ethers.utils.formatEther(
          gasUnits.mul(feeData.gasPrice!)
        );

        setTotals((t) => ({
          ...t,
          gasEstimate: number.limitDecimals(formattedGas, 6),
        }));
      })
      .catch(noop);
  }, [
    feeData,
    isAuthed,
    listing.id,
    provider,
    signer,
    totals.bondFeeTotal,
    totals.itemTotal,
  ]);

  return [totals] as const;
};

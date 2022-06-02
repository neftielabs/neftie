import type { ContractTransaction } from "ethers";
import { ethers } from "ethers";
import type { UseMutationOptions } from "react-query";

import type { IListingFull } from "@neftie/common";
import { useContractMutation } from "hooks/http/useContractMutation";
import { getListingContract } from "lib/web3/contracts";
import { withGasMargin } from "lib/web3/gas";

export const usePlaceOrder = (
  listing?: IListingFull | null,
  options?: UseMutationOptions<
    { tx: ContractTransaction; orderListing: IListingFull },
    unknown,
    null
  >
) => {
  return useContractMutation(async ({ signer }) => {
    if (!listing) {
      throw new Error("No listing");
    }

    const contract = await getListingContract(signer, listing.id);
    const price = ethers.utils.parseEther(listing.price);
    const bondFee = ethers.utils.parseEther(listing.bondFee);
    const weiValue = price.add(bondFee);

    const tx = await withGasMargin(contract, "placeOrder", [
      {
        value: weiValue,
      },
    ]);

    return {
      tx,
      orderListing: listing,
    };
  }, options);
};

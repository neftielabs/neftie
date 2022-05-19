import type { ContractTransaction } from "ethers";
import { ethers } from "ethers";
import type { UseMutationOptions } from "react-query";
import type { Asserts } from "yup";

import type { listingSchema } from "@neftie/common";
import { useContractMutation } from "hooks/http/useContractMutation";
import { getListingFactoryContract } from "lib/web3/contracts";
import { withGasMargin } from "lib/web3/gas";
import { getNumericNonce } from "utils/number";

type CreateListingVariables = Asserts<
  typeof listingSchema["createOnChainListing"]
>;
type CreateListingReturn = {
  address: string;
  tx: ContractTransaction;
};

export const useCreateListing = (
  options?: UseMutationOptions<
    CreateListingReturn,
    unknown,
    CreateListingVariables
  >
) => {
  return useContractMutation(async (data) => {
    const { signer, ...form } = data;

    // Start the transaction

    const price = ethers.utils.parseEther(String(form.price));
    const bondFee = ethers.utils.parseEther(String(form.bondFee));

    const contract = getListingFactoryContract(signer);
    const nonce = getNumericNonce();

    // Call the contract

    const tx = await withGasMargin(contract, "createListing", [
      form.title,
      price,
      bondFee,
      form.deliveryDays,
      form.revisions,
      nonce,
    ]);

    // Predict the listing address

    const predictedAddress = await contract.predictListingAddress(
      await signer.getAddress(),
      nonce
    );

    return {
      address: predictedAddress,
      tx,
    };
  }, options);
};

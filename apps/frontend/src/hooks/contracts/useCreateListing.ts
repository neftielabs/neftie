import { listingSchema } from "@neftie/common";
import { ContractTransaction, ethers } from "ethers";
import { useContractMutation } from "hooks/http/useContractMutation";
import { getListingFactoryContract } from "lib/web3/contracts";
import { withGasMargin } from "lib/web3/gas";
import { UseMutationOptions } from "react-query";
import { getNumericNonce } from "utils/number";
import { Asserts } from "yup";

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
      address: predictedAddress.toLowerCase(),
      tx,
    };
  }, options);
};

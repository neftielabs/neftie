import { Signer } from "ethers";
import { getListingFactoryContract } from "lib/web3/contracts";

/**
 * Since the ListingFactory is using OpenZeppelin Clones,
 * we can predict which address will any listing have even
 * if it hasn't been created yet.
 */
export const getPredictedListingAddress = async (
  seller: Signer,
  nonce: number
) => {
  const contract = getListingFactoryContract(seller);
  const sellerAddress = await seller.getAddress();

  return await contract.predictListingAddress(sellerAddress, nonce);
};

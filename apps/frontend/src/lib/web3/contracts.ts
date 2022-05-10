import { ListingFactory__factory, addresses } from "@neftie/contracts";
import { Signer } from "ethers";
import { APP_ENV } from "lib/constants/app";

const contractAddresses = addresses;
const currentEnv = APP_ENV;

/**
 * @returns The ListingFactory contract instance
 */
export const getListingFactoryContract = (signer: Signer) => {
  const contractAddress = contractAddresses[currentEnv].listingFactory;
  const listingFactory = ListingFactory__factory.connect(
    contractAddress,
    signer
  );

  return listingFactory;
};

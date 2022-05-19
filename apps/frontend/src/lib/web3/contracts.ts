import type { Signer } from "ethers";

import {
  ListingFactory__factory as ListingFactoryFactory,
  addresses,
} from "@neftie/contracts";
import { APP_ENV } from "lib/constants/app";

const contractAddresses = addresses;
const currentEnv = APP_ENV;

/**
 * @returns The ListingFactory contract instance
 */
export const getListingFactoryContract = (signer: Signer) => {
  const contractAddress = contractAddresses[currentEnv].listingFactory;
  const listingFactory = ListingFactoryFactory.connect(contractAddress, signer);

  return listingFactory;
};

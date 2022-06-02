import type { Signer } from "ethers";

import {
  Listing__factory as ListingFactory,
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

/**
 * @returns The Listing implementation contract instance
 */
export const getListingImplementationContract = async (signer: Signer) => {
  const listingFactory = getListingFactoryContract(signer);
  const contractAddress = await listingFactory.implementation();
  const listingImpl = ListingFactory.connect(contractAddress, signer);
  return listingImpl;
};

/**
 * @returns The Listing contract instance
 */
export const getListingContract = async (signer: Signer, address: string) => {
  const listingImpl = await getListingImplementationContract(signer);
  return listingImpl.attach(address);
};

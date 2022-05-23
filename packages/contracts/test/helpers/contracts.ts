/* eslint-disable camelcase */
/* eslint-disable init-declarations */
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import type { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";

import type { Listing, ListingFactory, NeftieCore } from "../../typechain";
import {
  ListingFactory__factory,
  Listing__factory,
  NeftieCore__factory,
} from "../../typechain";

type Addresses = {
  admin: SignerWithAddress;
  owner: SignerWithAddress;
  moderator: SignerWithAddress;
  user: SignerWithAddress;
};

/**
 * Creates a new listing and returns the listing's address
 */
export const createListing = async (
  data: {
    listingFactory: ListingFactory;
    params: Parameters<ListingFactory["createListing"]>;
  } & Pick<Addresses, "user">
) => {
  const { params, listingFactory, user } = data;

  const tx = await listingFactory.connect(user).createListing(...params);
  const address = await listingFactory.predictListingAddress(
    user.address,
    params[5]
  );

  return { address, tx };
};

/**
 * Deploy the NeftieCore contract that will initialize
 * roles and will receive fees and other payments.
 */
export const deployCore = async (
  data: Pick<Addresses, "admin" | "owner" | "moderator">
) => {
  const { owner, admin, moderator } = data;

  const _core = new NeftieCore__factory(owner);
  const core = (await upgrades.deployProxy(_core, [
    admin.address,
  ])) as NeftieCore;

  await core.deployed();

  await core.connect(admin).grantModerator(moderator.address);

  return core;
};

/**
 * Deploy the ListingFactory contract, that will allow the creation
 * of new listings while allowing upgrades on the listing implementation
 * contract.
 */
export const deployListingFactory = async (
  data: Pick<Addresses, "owner"> & { coreContract: Contract }
) => {
  const { owner, coreContract } = data;

  const _listingFactory = new ListingFactory__factory(owner);
  const listingFactory = await _listingFactory.deploy(coreContract.address);
  await listingFactory.deployed();

  return listingFactory;
};

/**
 * Deploy the Listing implementation contract that will serve
 * as a template for all listings
 */
export const deployListingImpl = async (
  data: Pick<Addresses, "owner"> & { listingFactory: ListingFactory }
) => {
  const { owner, listingFactory } = data;

  const _listing = new Listing__factory(owner);
  const listingImplementation = await _listing.deploy(listingFactory.address);

  await listingImplementation.deployed();

  return listingImplementation as Listing;
};

/**
 * Deploy all contracts.
 * These include:
 *  - Core
 *  - Listing implementation
 *  - Listing factory
 */
export const deployAll = async () => {
  const [admin, owner, moderator, user, client] = await ethers.getSigners();

  const core = await deployCore({ owner, admin, moderator });
  const listingFactory = await deployListingFactory({
    owner,
    coreContract: core,
  });
  const listingImpl = await deployListingImpl({ owner, listingFactory });

  await listingFactory
    .connect(admin)
    .updateImplementationContract(listingImpl.address);

  return {
    core,
    listingFactory,
    listingImpl,
    signers: { admin, owner, moderator, user, client },
  };
};

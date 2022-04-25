/* eslint-disable no-console */
import { ethers, upgrades } from "hardhat";
import {
  ListingFactory__factory,
  Listing__factory,
  NeftieCore,
  NeftieCore__factory,
} from "../typechain";

async function main() {
  const admin = await ethers.getSigner(
    "0x2a09e1e008Aa84c481894737b3D7A22f1dB63c90"
  );

  // Deploy core

  const _core = new NeftieCore__factory(admin);
  const core = (await upgrades.deployProxy(_core, [
    admin.address,
  ])) as NeftieCore;
  await core.deployed();

  // Deploy listing factory

  const listingFactory = await new ListingFactory__factory(admin).deploy(
    core.address
  );
  await listingFactory.deployed();

  // Deploy listing implementation

  const listingImpl = await new Listing__factory(admin).deploy(
    listingFactory.address
  );
  await listingImpl.deployed();

  await listingFactory
    .connect(admin)
    .updateImplementationContract(listingImpl.address);

  console.log({
    core: core.address,
    listingFactory: listingFactory.address,
    listingImpl: listingImpl.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

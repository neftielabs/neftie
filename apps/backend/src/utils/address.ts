import { ethers } from "ethers";

/**
 * Transform an address to checksum
 */
export const toChecksum = (address: string) => {
  let checksumAddress = address;

  try {
    checksumAddress = ethers.utils.getAddress(address);
  } catch {}

  return checksumAddress;
};

/**
 * Transform both addresses to checksum and compare them
 */
export const areAddressesEqual = (address1: string, address2: string) =>
  toChecksum(address1) === toChecksum(address2);

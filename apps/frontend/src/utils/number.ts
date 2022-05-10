/**
 * This is used to create new listings, where the seller + nonce
 * combination must be unique. It is not bulletproof since collisions
 * can happen, but should be good for now.
 */
export const getNumericNonce = () => Math.floor(Math.random() * 10000000);

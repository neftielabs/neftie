export const isValidAddress = (address: string) =>
  // eslint-disable-next-line wrap-regex
  /^0x[a-fA-F0-9]{40}$/.test(address);

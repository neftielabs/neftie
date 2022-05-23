export const shortenAddress = (address: string) =>
  address.slice(0, 10) + "..." + address.slice(-5);

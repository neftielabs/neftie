import { TypedMap } from "@graphprotocol/graph-ts";

export const orderStatusMap = new TypedMap<number, string>();
orderStatusMap.set(0, "PLACED");
orderStatusMap.set(1, "DISMISSED");
orderStatusMap.set(2, "ONGOING");
orderStatusMap.set(3, "CANCELLED");
orderStatusMap.set(4, "DELIVERED");
orderStatusMap.set(5, "COMPLETED");

export const mapOrderStatus = (a: number): string => {
  if (a === 0) {
    return "PLACED";
  }

  if (a === 1) {
    return "DISMISSED";
  }

  if (a === 2) {
    return "ONGOING";
  }

  if (a === 3) {
    return "CANCELLED";
  }

  if (a === 4) {
    return "DELIVERED";
  }

  if (a === 5) {
    return "COMPLETED";
  }

  return "PLACED";
};

import type {
  BondFeeWithdrawn,
  OrderApproved,
  OrderCancelled,
  OrderDelivered,
  OrderDismissed,
  OrderPlaced,
  OrderWithdrawn,
  Tip,
} from "../../generated/templates/Listing/Listing";
import { weiToEth } from "../utils/eth";
import { mapOrderStatus } from "../utils/order";
import {
  getClientEntity,
  getListingEntity,
  getOrderEntity,
  getTipEntity,
} from "../utils/store";

enum OrderStatus {
  PLACED,
  DISMISSED,
  ONGOING,
  CANCELLED,
  DELIVERED,
  COMPLETED,
}

export function handleOrderPlaced(event: OrderPlaced): void {
  const listing = getListingEntity(event.address.toHex());

  const client = getClientEntity(event.params.client.toHex());
  client.save();

  const order = getOrderEntity(event.params.orderId);
  order.listing = listing.id;
  order.client = client.id;
  order.status = mapOrderStatus(event.params.status);
  order.bondFeeWithdrawn = false;
  order.revisionsLeft = event.params.revisionsLeft.toI32();
  order.startedAt = event.params.startedAt;
  order.save();
}

export function handleOrderApproved(event: OrderApproved): void {
  const order = getOrderEntity(event.params.orderId);
  order.status = mapOrderStatus(OrderStatus.ONGOING);
  order.save();
}

export function handleOrderDismissed(event: OrderDismissed): void {
  const order = getOrderEntity(event.params.orderId);
  order.status = mapOrderStatus(OrderStatus.DISMISSED);
  order.save();
}

export function handleOrderCancelled(event: OrderCancelled): void {
  const order = getOrderEntity(event.params.orderId);
  order.status = mapOrderStatus(OrderStatus.CANCELLED);
  order.cancelledAt = event.params.cancelledAt;
  order.save();
}

export function handleOrderDelivered(event: OrderDelivered): void {
  const order = getOrderEntity(event.params.orderId);
  order.status = mapOrderStatus(OrderStatus.DELIVERED);
  order.deliveredAt = event.params.deliveredAt;
  order.save();
}

export function handleTip(event: Tip): void {
  const tipId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  const tip = getTipEntity(tipId);
  tip.amount = weiToEth(event.params.amount);
  tip.order = event.params.orderId;
  tip.timestamp = event.block.timestamp;
  tip.save();

  const order = getOrderEntity(event.params.orderId);
  const tips = order.tips;
  tips.push(tipId);
  order.tips = tips;
  order.save();
}

export const handleBondFeeWithdrawn = (event: BondFeeWithdrawn): void => {
  const order = getOrderEntity(event.params.orderId);
  order.bondFeeWithdrawn = true;
  order.save();
};

export const handleOrderWithdrawn = (event: OrderWithdrawn): void => {
  const order = getOrderEntity(event.params.orderId);
  order.status = mapOrderStatus(OrderStatus.COMPLETED);
  order.completedAt = event.block.timestamp;
  order.save();
};

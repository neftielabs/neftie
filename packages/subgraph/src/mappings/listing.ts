import {
  BondFeeWithdrawn,
  OrderApproved,
  OrderCancelled,
  OrderDelivered,
  OrderDismissed,
  OrderPlaced,
  OrderWithdrawn,
  RevisionRequested,
  Tip,
} from "../../generated/templates/Listing/Listing";
import { buildOrderId, mapOrderStatus } from "../utils/order";
import { weiToEth } from "../utils/eth";
import {
  getListingEntity,
  getOrderEntity,
  getTipEntity,
  getUserEntity,
  registerOrderEvent,
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
  const seller = getUserEntity(listing.seller);

  const client = getUserEntity(event.params.client.toHex());
  client.save();

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.tx = event.transaction.hash.toHex();
  order.listing = listing.id;
  order.client = client.id;
  order.seller = seller.id;
  order.status = mapOrderStatus(event.params.status);
  order.bondFeeWithdrawn = false;
  order.underRevision = false;
  order.revisionsLeft = event.params.revisionsLeft.toI32();
  order.lastEventAt = event.block.timestamp;
  order.save();

  registerOrderEvent(event, "PLACED", client.id, order.id);
}

export function handleOrderApproved(event: OrderApproved): void {
  const listing = getListingEntity(event.address.toHex());

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.status = mapOrderStatus(OrderStatus.ONGOING);
  order.lastEventAt = event.block.timestamp;
  order.save();

  registerOrderEvent(event, "STARTED", order.seller, order.id);
}

export function handleOrderDismissed(event: OrderDismissed): void {
  const listing = getListingEntity(event.address.toHex());

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.status = mapOrderStatus(OrderStatus.DISMISSED);
  order.lastEventAt = event.block.timestamp;
  order.save();

  registerOrderEvent(event, "DISMISSED", event.params.author.toHex(), order.id);
}

export function handleOrderCancelled(event: OrderCancelled): void {
  const listing = getListingEntity(event.address.toHex());

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.status = mapOrderStatus(OrderStatus.CANCELLED);
  order.lastEventAt = event.block.timestamp;
  order.save();

  registerOrderEvent(event, "CANCELLED", event.params.author.toHex(), order.id);
}

export function handleOrderDelivered(event: OrderDelivered): void {
  const listing = getListingEntity(event.address.toHex());

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.status = mapOrderStatus(OrderStatus.DELIVERED);
  order.underRevision = false;
  order.lastEventAt = event.block.timestamp;
  order.save();

  registerOrderEvent(event, "DELIVERED", order.seller, order.id);
}

export function handleRevisionRequested(event: RevisionRequested): void {
  const listing = getListingEntity(event.address.toHex());

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.underRevision = true;
  order.status = mapOrderStatus(OrderStatus.ONGOING);
  order.lastEventAt = event.block.timestamp;
  order.save();

  registerOrderEvent(event, "REVISION", order.client, order.id);
}

export function handleTip(event: Tip): void {
  const listing = getListingEntity(event.address.toHex());

  const tipId = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  const tip = getTipEntity(tipId);
  tip.amount = weiToEth(event.params.amount);
  tip.order = buildOrderId(event.params.orderId, listing.id);
  tip.timestamp = event.block.timestamp;
  tip.save();

  const order = getOrderEntity(event.params.orderId, listing.id);
  const tips = order.tips;
  tips.push(tipId);
  order.tips = tips;
  order.save();
}

export const handleBondFeeWithdrawn = (event: BondFeeWithdrawn): void => {
  const listing = getListingEntity(event.address.toHex());

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.bondFeeWithdrawn = true;
  order.save();
};

export const handleOrderWithdrawn = (event: OrderWithdrawn): void => {
  const listing = getListingEntity(event.address.toHex());

  const order = getOrderEntity(event.params.orderId, listing.id);
  order.status = mapOrderStatus(OrderStatus.COMPLETED);
  order.lastEventAt = event.block.timestamp;
  order.save();

  registerOrderEvent(event, "COMPLETED", order.seller, order.id);
};

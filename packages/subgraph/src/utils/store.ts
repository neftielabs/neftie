import { BigInt, ethereum } from "@graphprotocol/graph-ts";

import { Listing, Order, OrderEvent, Tip, User } from "../../generated/schema";
import { buildOrderId } from "./order";

/**
 * Loads a user
 */
export const getUserEntity = (id: string): User => {
  let user = User.load(id);

  if (!user) {
    user = new User(id);
  }

  return user;
};

/**
 * Loads a listing
 */
export const getListingEntity = (id: string): Listing => {
  let listing = Listing.load(id);

  if (!listing) {
    listing = new Listing(id);
  }

  return listing;
};

/**
 * Loads an order
 */
export const getOrderEntity = (orderId: BigInt, listingId: string): Order => {
  const id = buildOrderId(orderId, listingId);
  let order = Order.load(id);

  if (!order) {
    order = new Order(id);
  }

  return order;
};

/**
 * Loads a tip
 */
export const getTipEntity = (id: string): Tip => {
  let tip = Tip.load(id);

  if (!tip) {
    tip = new Tip(id);
  }

  return tip;
};

/**
 * Loads an order event
 */
export const getOrderEventEntity = (id: string): OrderEvent => {
  let event = OrderEvent.load(id);

  if (!event) {
    event = new OrderEvent(id);
  }

  return event;
};

/**
 * Registers an order event
 */
export const registerOrderEvent = (
  event: ethereum.Event,
  type: string,
  from: string,
  orderId: string
): void => {
  const orderEventId = event.transaction.hash
    .toHex()
    .concat("_".concat(event.logIndex.toString()));
  const orderEvent = getOrderEventEntity(orderEventId);
  orderEvent.type = type;
  orderEvent.timestamp = event.block.timestamp;
  orderEvent.from = from;
  orderEvent.order = orderId;
  orderEvent.save();
};

import { BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { Client, Listing, Order, Seller, Tip } from "../../generated/schema";
import { buildOrderId } from "./order";

/**
 * Loads a seller
 */
export const getSellerEntity = (id: string): Seller => {
  let seller = Seller.load(id);

  if (!seller) {
    seller = new Seller(id);
  }

  return seller;
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
 * Loads a client
 */
export const getClientEntity = (id: string): Client => {
  let client = Client.load(id);

  if (!client) {
    client = new Client(id);
  }

  return client;
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

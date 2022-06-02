import type {
  OrderEventType as OrderEventEnum,
  OrderFullFragment,
  OrderMinimalFragment,
  OrderStatus,
} from "@neftie/subgraph";

import type { IListingFull } from "./listing";
import type { MergedUser } from "./user";

export interface IOrderPreview extends Pick<OrderMinimalFragment, "listing"> {
  id: number;
  status: OrderStatusType;
  composedId: string;
  client: MergedUser;
  seller: MergedUser;
  lastEventAt: string;
}

export type OrderEventType = Uppercase<keyof typeof OrderEventEnum>;
export type OrderStatusType = Uppercase<keyof typeof OrderStatus>;

export interface IOrderStatusEvent {
  type: OrderEventType;
  timestamp: string;
  from: "seller" | "client";
}

export interface IOrderMessageEvent extends Omit<IOrderStatusEvent, "type"> {
  type: "message";
  message: string;
}

export type IOrderEvent = IOrderStatusEvent | IOrderMessageEvent;

export interface IOrderFull
  extends Omit<IOrderPreview, "lastEventAt">,
    Pick<
      OrderFullFragment,
      "revisionsLeft" | "underRevision" | "bondFeeWithdrawn" | "tips"
    > {
  listing: Omit<IListingFull, "seller">;
  isSeller: boolean;
  events: (IOrderStatusEvent | IOrderMessageEvent)[];
}

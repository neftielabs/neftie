import type {
  OrderEventType as OrderEventEnum,
  OrderFullFragment,
  OrderMinimalFragment,
} from "@neftie/subgraph";

import type { IListingFull } from "./listing";
import type { MergedUser } from "./user";

export interface IOrderPreview
  extends Pick<OrderMinimalFragment, "status" | "listing"> {
  id: number;
  composedId: string;
  client: MergedUser;
  seller: MergedUser;
}

export type OrderEventType = Uppercase<keyof typeof OrderEventEnum>;

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
  extends IOrderPreview,
    Pick<
      OrderFullFragment,
      "status" | "revisionsLeft" | "underRevision" | "bondFeeWithdrawn" | "tips"
    > {
  listing: Omit<IListingFull, "seller">;
  isSeller: boolean;
  events: (IOrderStatusEvent | IOrderMessageEvent)[];
}

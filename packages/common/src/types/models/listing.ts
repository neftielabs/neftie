import type {
  ListingFullFragment,
  ListingMinimalFragment,
} from "@neftie/subgraph";

import type { MergedUser } from "./user";

export interface IListingPreview
  extends Pick<ListingMinimalFragment, "id" | "title" | "price"> {
  coverUrl: string | null;
  description: string | null;
  seller: MergedUser;
}

export interface IListingFull
  extends IListingPreview,
    Pick<ListingFullFragment, "deliveryDays" | "bondFee" | "revisions"> {}

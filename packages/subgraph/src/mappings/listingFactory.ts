import { ListingCreated } from "../../generated/ListingFactory/ListingFactory";
import { Listing } from "../../generated/templates";
import { weiToEth } from "../utils/eth";
import { getListingEntity, getSellerEntity } from "../utils/store";

export function handleListingCreated(event: ListingCreated): void {
  Listing.create(event.params.listingAddress);

  const seller = getSellerEntity(event.params.seller.toHex());
  seller.save();

  const listing = getListingEntity(event.params.listingAddress.toHex());
  listing.seller = seller.id;
  listing.title = event.params.title;
  listing.price = weiToEth(event.params.price);
  listing.bondFee = weiToEth(event.params.bondFee);
  listing.deliveryDays = event.params.deliveryDays;
  listing.revisions = event.params.revisions;
  listing.save();
}

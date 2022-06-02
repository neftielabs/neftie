import { ListingCreated } from "../../generated/ListingFactory/ListingFactory";
import { Listing } from "../../generated/templates";
import { weiToEth } from "../utils/eth";
import { getListingEntity, getUserEntity } from "../utils/store";

export function handleListingCreated(event: ListingCreated): void {
  Listing.create(event.params.listingAddress);

  const seller = getUserEntity(event.params.seller.toHex());
  seller.save();

  const listing = getListingEntity(event.params.listingAddress.toHex());
  listing.seller = seller.id;
  listing.title = event.params.title;
  listing.price = weiToEth(event.params.price);
  listing.bondFee = weiToEth(event.params.bondFee);
  listing.deliveryDays = event.params.deliveryDays.toI32();
  listing.revisions = event.params.revisions.toI32();
  listing.save();
}

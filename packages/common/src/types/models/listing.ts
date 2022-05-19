import { UserSafe } from "./user";

export type ListingPreview = {
  id: string;
  title: string;
  price: string;
  coverUrl: string | null;
  description: string | null;
  seller: {
    id: string;
    user: Pick<UserSafe, "username" | "avatarUrl" | "address"> | null;
  };
};

export type ListingFull = ListingPreview & {
  bondFee: string;
  deliveryDays: string;
  revisions: string;
  orders: [];
};

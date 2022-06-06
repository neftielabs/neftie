export type UserSafe = {
  id: string;
  name: string | null;
  username: string;
  avatarUrl: string;
  bannerUrl: string | null;
  createdAt: Date;
  verified: boolean;
};

export interface UserFullSafe extends UserSafe {
  twitterHandle: string | null;
  websiteUrl: string | null;
  bio: string | null;
  location: string | null;
}

export type MergedUser = {
  id: string;
  user: Pick<UserSafe, "username" | "id" | "avatarUrl" | "verified"> | null;
};

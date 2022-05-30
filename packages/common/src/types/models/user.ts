export type UserSafe = {
  id: string;
  name: string | null;
  username: string;
  avatarUrl: string;
  bannerUrl: string | null;
};

export type MergedUser = {
  id: string;
  user: Pick<UserSafe, "username" | "id" | "avatarUrl"> | null;
};

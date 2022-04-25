export type UserSafe = {
  address: string;
  name: string | null;
  username: string;
  avatar: {
    url: string;
    alt?: string;
  };
  banner: {
    url: string | null;
    alt?: string;
  };
};

import { Prisma } from "@neftie/prisma";

export const userSafeSelect = Prisma.validator<Prisma.UserSelect>()({
  address: true,
  name: true,
  username: true,
  avatarUri: true,
  bannerUri: true,
});

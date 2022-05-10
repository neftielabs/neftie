import { Prisma } from "@neftie/prisma";
import { prisma } from "config/database";

export const create = async (data: Prisma.ListingUncheckedCreateInput) => {
  return await prisma.listing.create({
    data,
  });
};

export const get = async (where: Prisma.ListingWhereInput) => {
  return await prisma.listing.findFirst({
    where,
  });
};

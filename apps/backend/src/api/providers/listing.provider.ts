import type { Prisma } from "@neftie/prisma";
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

export const getMany = async (where: Prisma.ListingWhereInput) => {
  return await prisma.listing.findMany({ where });
};

export const update = async (
  address: string,
  sellerId: string,
  data: Prisma.ListingUncheckedUpdateManyInput
) => {
  return await prisma.listing.updateMany({
    where: {
      address,
      sellerId,
    },
    data,
  });
};

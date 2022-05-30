import type { Prisma } from "@neftie/prisma";
import { prisma } from "config/database";

export const create = async (data: Prisma.OrderUncheckedCreateInput) => {
  return await prisma.order.create({ data, include: { listing: true } });
};

export const getByComposedId = async (
  id: string | Prisma.OrderIdListingIdCompoundUniqueInput
) => {
  return await prisma.order.findUnique({
    // eslint-disable-next-line camelcase
    where: typeof id === "string" ? { composedId: id } : { id_listingId: id },
    include: { listing: true },
  });
};

export const getMessages = async (orderComposedId: string) => {
  return await prisma.orderMessage.findMany({
    where: {
      orderComposedId,
    },
  });
};

export const getMany = async (where: Prisma.OrderWhereInput) => {
  return await prisma.order.findMany({ where });
};

import type { Prisma } from "@neftie/prisma";
import { prisma } from "config/database";

export const create = async (data: Prisma.OrderUncheckedCreateInput) => {
  return await prisma.order.create({ data });
};

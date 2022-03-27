import { Prisma } from "@neftie/prisma";
import { prisma } from "config/database";

export const getByPublicKey = async (publicKey: string) => {
  return await prisma.user.findUnique({
    where: { publicKey },
  });
};

export const create = async (data: Prisma.UserUncheckedCreateInput) => {
  return await prisma.user.create({ data });
};

export const getById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

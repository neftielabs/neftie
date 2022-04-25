import { Prisma } from "@neftie/prisma";
import { prisma } from "config/database";

export const getByAddress = async (address: string) => {
  return await prisma.user.findUnique({
    where: { address },
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

export const getByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const update = async (
  id: string,
  data: Prisma.UserUncheckedUpdateInput
) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

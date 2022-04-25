import { PrismaClient } from "@neftie/prisma";

/**
 * Tests database connection by creating a new client and
 * connecting to it. If it throws, the loading step will fail.
 */
export const prismaLoader = async () => {
  const client = new PrismaClient();
  await client.$connect();
  await client.$disconnect();
};

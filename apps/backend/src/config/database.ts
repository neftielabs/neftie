import { PrismaClient, PrismaFactory } from "@neftie/prisma";
import logger from "modules/Logger/Logger";
import { withExclude } from "prisma-exclude";
import { isProd } from "utils/constants";

/**
 * The main Prisma instance.
 */
export const prisma = PrismaFactory.getInstance("db-main", () => {
  const client = withExclude(
    new PrismaClient({
      errorFormat: isProd ? "colorless" : "pretty",
      log: [
        {
          level: "query",
          emit: "event",
        },
        {
          level: "error",
          emit: "stdout",
        },
        {
          level: "info",
          emit: "stdout",
        },
        {
          level: "warn",
          emit: "stdout",
        },
      ],
    })
  );

  if (isProd) {
    // Log queries using the db level
    client.$on("query", (e) => {
      logger.log("db", `Query: ${e.query} (took ${e.duration}ms)`);
    });
  }

  return client;
});

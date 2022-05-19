import { PrismaClient, PrismaFactory } from "@neftie/prisma";
import logger from "modules/Logger/Logger";
import { withExclude } from "prisma-exclude";
import { toChecksum } from "utils/address";
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

  const addressModels = ["User", "Listing"];

  /**
   * Based on the assumption that all fields named
   * `address` use checksum addresses, this middleware intercepts
   * and converts them to checksum.
   * Models can be filtered if there's any conflicts.
   */
  client.$use((params, next) => {
    if (!params.model || !addressModels.includes(params.model)) {
      return next(params);
    }

    /**
     * We store addresses in checksum format, since only TheGraph works
     * with all lowercase. In order to accomplish that, we will replace
     * all addresses our regex catches and transform them to checksum.
     */

    // #todo measure performance impact of this

    const args = JSON.parse(
      JSON.stringify(params.args).replace(/(0x[a-fA-F0-9]{40})/g, (a) =>
        toChecksum(a)
      )
    );

    params.args = args;

    return next(params);
  });

  return client;
});

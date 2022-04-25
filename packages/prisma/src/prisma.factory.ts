/**
 * If the framework refreshes the module responsible for exporting PrismaClient,
 * this can result in additional, unwanted instances of PrismaClient
 * in a development environment.
 *
 * As a workaround, you can store PrismaClient as a global variable in development
 * environments only, as global variables are not reloaded.
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 */

import { PrismaClient } from "@prisma/client";
import { WithExclude } from "prisma-exclude/dist/types";

type CustomClient = PrismaClient & {
  $exclude: ReturnType<WithExclude>["$exclude"];
};

// eslint-disable-next-line init-declarations
declare let global: {
  PRISMA: Record<string, CustomClient> | undefined;
};

export class PrismaFactory {
  private static instances?: Record<string, CustomClient>;
  private constructor() {}

  static getInstance(
    key: string,
    clientGenerator: () => CustomClient
  ): CustomClient {
    if (process.env.NODE_ENV === "production") {
      if (!PrismaFactory.instances?.[key]) {
        PrismaFactory.instances ??= {};
        PrismaFactory.instances[key] = clientGenerator();
      }

      return PrismaFactory.instances[key];
    }

    if (!global.PRISMA?.[key]) {
      global.PRISMA ??= {};
      global.PRISMA[key] = clientGenerator();
    }

    return global.PRISMA[key];
  }
}

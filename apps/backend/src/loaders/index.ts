/* eslint-disable no-console */
import express from "express";
import { envLoader } from "loaders/env";
import { expressLoader } from "loaders/express";
import { prismaLoader } from "loaders/prisma";
import logger from "modules/Logger/Logger";

/**
 * Loads everything needed for the application to run
 * correctly and perfom all needed tasks.
 */
export default async (expressApp: express.Application) => {
  console.log("\n");

  /**
   * Validate env variables and ensure the required ones
   * are set.
   */
  await envLoader();
  logger.info("⚡ Env variables validated");

  /**
   * Test database connection
   */
  await prismaLoader();
  logger.info("⚡ Postgres loaded and connected");

  /**
   * Load all Express middlewares, routes,
   * and everything needed
   */
  expressLoader(expressApp);
  logger.info("⚡ Express loaded");
};

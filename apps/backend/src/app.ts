/* eslint-disable no-console */
import { createTerminus } from "@godaddy/terminus";
import dotenv from "dotenv";
import express from "express";

import { config } from "config/main";
import logger from "modules/Logger/Logger";
import { createWebSocketServer } from "modules/websocket/server";

dotenv.config();

const startServer = async () => {
  /**
   * Express instance
   */
  const app: express.Application = express();

  /**
   * Load all services and configurations
   */
  try {
    await (await import("./loaders")).default(app);
  } catch (error: any) {
    if ("path" in error && "params" in error) {
      // This is an error from the env loader.
      // If we straight log the entire error, it'll
      // print all the environment variables
      console.log(error.path, error.params);
    } else {
      console.log(error);
    }

    logger.error("🔴 " + (error.message || error));
    logger.error(
      "🔴 An error occurred while initializing all loaders. Shutting down.",
      error
    );
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  /**
   * Start Express server on specified port
   */
  const server = app.listen(config.port, () => {
    console.log("\n");
    logger.info(`🚀 Express server started successfully`);
    logger.info(`🌎 Live on ${config.roots.server}`);
    logger.info(`🔨 Environment: ${config.env}`);
    console.log("\n");

    // Inform that the server is ready to process requests

    if (process.send) {
      process.send("ready");
    }
  });

  /**
   * Initialize websocket server
   */

  createWebSocketServer(server);

  /**
   * Graceful shutdown
   *
   * When stopping the server, it is essential to serve
   * all pending requests and stop all services before
   * quiting
   */
  createTerminus(server, {
    timeout: 5000,
    onSignal: () => {
      logger.info("SIGTERM received");

      return Promise.all([
        // @todo Stop all services
      ]);
    },
    onShutdown: () => {
      logger.info("Cleanup done, shutting down gracefully");
      return Promise.all([
        // @todo Anything that needs to be done
      ]);
    },
    logger: (msg, err) => logger.warn(msg, err),
  });
};

startServer();

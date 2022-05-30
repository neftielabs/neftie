import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";

import { errorMiddleware, rateLimitMiddleware } from "api/middleware";
import { loggingMiddleware } from "api/middleware/logging.middleware";
import { v1Router } from "api/routes/v1.routes";
import { config } from "config/main";
import { isProd } from "utils/constants";

export const expressLoader = (app: express.Application) => {
  /**
   *
   * Error Reporting with Sentry
   *
   */
  Sentry.init({
    dsn: "https://0ec4afc5da5847cd861c9951b34879ad@o1069630.ingest.sentry.io/6064819",
    integrations: [
      // Enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // Enable express middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    tracesSampleRate: 1.0,

    // Disable Sentry for non-prod environments
    enabled: isProd,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());

  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  /**
   *
   * Configuration
   *
   */

  app.set("trust proxy", true);
  app.use(express.static("public"));

  /**
   *
   * Middleware
   *
   */

  // Request logging

  app.use(loggingMiddleware);

  // Parse body params and attach them to req.body

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Set default application/json content-type

  app.use((_, res, next) => {
    res.contentType("application/json");
    return next();
  });

  // Gzip compression

  app.use(compression());

  // Layer of protection by setting various HTTP headers

  app.use(helmet());

  // Protection against HTTP Parameter Pollution attacks

  app.use(hpp());

  // Enable CORS

  const corsOptions: cors.CorsOptions = {
    origin: [config.roots.client],
    credentials: true,
  };

  app.use(cors(corsOptions));

  // Parse cookies

  app.use(cookieParser(config.cookies.secret));

  // Global rate limiter

  app.use(rateLimitMiddleware.global);

  /**
   *
   * Routes
   *
   */

  app.use("/v1", v1Router);

  /**
   *
   * Error handling
   *
   */

  // The Sentry error handler must be before any other error middleware

  app.use(Sentry.Handlers.errorHandler());

  // Handles unknown routes (404) and forwards requests to our error handler

  app.use(errorMiddleware.notFound);

  // Handle unhandled rejections of promises and uncaught expections

  process.on("unhandledRejection", errorMiddleware.unhandledRejection);
  process.on("uncaughtException", errorMiddleware.uncaughtException);

  // If none of the above apply, process errors through our final handler

  app.use(errorMiddleware.finalErrorHandler);
};

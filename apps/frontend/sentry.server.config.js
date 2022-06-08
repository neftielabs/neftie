// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProdOrStaging = ["production", "staging"].includes(
  process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development"
);

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://ce6ebfa12b1449d2b5d3deeecd0f243f@o1172138.ingest.sentry.io/6258311",
  tracesSampleRate: 1.0,
  enabled: isProdOrStaging,
});

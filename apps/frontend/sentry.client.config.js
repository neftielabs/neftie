// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProdOrStaging = ["production", "staging"].includes(
  process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development"
);

Sentry.init({
  dsn:
    SENTRY_DSN ||
    "https://ce6ebfa12b1449d2b5d3deeecd0f243f@o949069.ingest.sentry.io/6258311",
  tracesSampleRate: 1.0,
  enabled: isProdOrStaging,
  tunnel: "/api/tunnel",
});

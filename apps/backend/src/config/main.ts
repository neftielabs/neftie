import * as env from "config/constants";

/**
 * Contains all configuration for our
 * application
 */
export const config = {
  env: env.NODE_ENV,
  port: +env.PORT,
  roots: {
    base: env.BASE_DOMAIN,
    server: env.SERVER_ROOT,
    client: env.CLIENT_ROOT,
  },
  keys: {
    cookie: env.COOKIE_SIGN_KEY,
  },
};

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
  cookies: {
    _prefix: "@neftie",
    secret: env.COOKIE_SECRET,
  },
  tokens: {
    access: {
      key: "@neftie/at",
      secret: env.ACCESS_TOKEN_SECRET,
      expires: "6d",
    },
  },
  files: {
    uploadsPath: env.UPLOADS_PATH,
  },
};

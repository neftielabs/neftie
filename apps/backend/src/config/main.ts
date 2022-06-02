import * as env from "config/constants";

/**
 * Contains all configuration for our
 * application
 */
export const config = {
  env: env.NODE_ENV,
  port: +env.PORT,

  /**
   * Known URLs
   */
  roots: {
    base: env.BASE_DOMAIN,
    server: env.SERVER_ROOT,
    client: env.CLIENT_ROOT,
    media: env.MEDIA_SERVER_URL,
  },

  /**
   * Cookies global config
   */
  cookies: {
    _prefix: "@neftie",
    secret: env.COOKIE_SECRET,
  },

  /**
   * Auth/service token configuration
   */
  tokens: {
    access: {
      key: "@neftie/at",
      wsKey: "x-access-token",
      secret: env.ACCESS_TOKEN_SECRET,
      expires: "6d",
      currentVersion: 1,
    },
  },

  /**
   * 3rd party configuration
   */
  external: {
    aws: {
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY,
        secretAccessKey: env.AWS_SECRET_KEY,
      },
    },
    subgraph: {
      endpoint: env.THEGRAPH_ENDPOINT,
    },
    coinmarketcap: {
      apikey: env.COINMARKETCAP_API_KEY,
    },
  },
};

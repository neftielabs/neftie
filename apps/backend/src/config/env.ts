import * as yup from "yup";

import type * as env from "config/constants";

type EnvSchema = { [K in keyof typeof env | "NODE_ENV"]: any };

export const envSchema: yup.SchemaOf<EnvSchema> = yup.object({
  /**
   * Server config
   */

  PORT: yup.number().notRequired(),
  CLIENT_ROOT: yup.string().required(),
  SERVER_ROOT: yup.string().required(),
  BASE_DOMAIN: yup.string().required(),
  MEDIA_SERVER_URL: yup.string().required(),
  DATABASE_URL: yup.string().required(),
  NODE_ENV: yup
    .string()
    .oneOf(["development", "production", "test"])
    .required(),

  /**
   * Secrets
   */

  COOKIE_SECRET: yup.string().required(),
  ACCESS_TOKEN_SECRET: yup.string().required(),

  /**
   * 3rd party
   */
  AWS_REGION: yup.string().required(),
  AWS_ACCESS_KEY: yup.string().required(),
  AWS_SECRET_KEY: yup.string().required(),
  THEGRAPH_ENDPOINT: yup.string().required(),
  COINMARKETCAP_API_KEY: yup.string().required(),
});

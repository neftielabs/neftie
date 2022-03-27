import * as yup from "yup";
import * as env from "config/constants";

type EnvSchema = { [K in keyof typeof env | "NODE_ENV"]: any };

export const envSchema: yup.SchemaOf<EnvSchema> = yup.object({
  /**
   * Server config
   */

  PORT: yup.number().notRequired(),
  CLIENT_ROOT: yup.string().required(),
  SERVER_ROOT: yup.string().required(),
  BASE_DOMAIN: yup.string().required(),
  NODE_ENV: yup
    .string()
    .oneOf(["development", "production", "test"])
    .required(),

  /**
   * Secrets
   */

  COOKIE_SECRET: yup.string().required(),
  ACCESS_TOKEN_SECRET: yup.string().required(),
});

import { envSchema } from "config/env";

/**
 * Tests and validates that the env variables are set correctly and
 * that the mainconfig object is safe to use from this point forward.
 */
export const envLoader = async () => {
  await envSchema.validate(process.env);
};

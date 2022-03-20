/**
 * Determines wether we are in a production environment
 */
export const isProd = process.env.NODE_ENV === "production";

/**
 * Determines wether we are in a staging environment, where
 * NODE_ENV would be "production"
 */
export const isStaging = process.env.STAGING === "1";

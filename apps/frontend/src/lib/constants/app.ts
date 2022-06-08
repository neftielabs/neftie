export const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL || "";
console.log({ API_BASEURL });
export const WS_BASEURL = process.env.NEXT_PUBLIC_WS_BASEURL || "";

export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_APIKEY;

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as
  | "development"
  | "production";

/**
 * The featured listing on the homepage
 */
export const HOME_FEATURED_LISTING =
  "0xc0e17754cfac313cf784381b42ff372853cd9d8f";

/**
 * Trending listings on the homepage
 */
export const HOME_TRENDING_LISTINGS = [""];

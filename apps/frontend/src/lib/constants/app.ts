export const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL || "";

export const WS_BASEURL = process.env.NEXT_PUBLIC_WS_BASEURL || "";

export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_APIKEY;

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as
  | "development"
  | "production";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

/**
 * The featured listing on the homepage
 */
export const HOME_FEATURED_LISTING =
  "0xc4e7545806a0091e54fe73de59d81e8318b1e5ad";

/**
 * Trending listings on the homepage
 */
export const HOME_TRENDING_LISTINGS = [
  "0xc0e17754cfac313cf784381b42ff372853cd9d8f",
  "0xc621dd5c2ae6b7b7c75b90cbef8cef2a9159ba9f",
  "0x46be95a82ec280fa94edd8889915aa56f64b6877",
];

export const API_BASEURL = process.env.NEXT_PUBLIC_API_BASEURL || "";

export const ASSETS_BASEURL = process.env.NEXT_PUBLIC_ASSETS_BASEURL || "";

export const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_APIKEY;

export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV as
  | "development"
  | "production";

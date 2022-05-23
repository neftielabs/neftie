import { APP_ENV } from "lib/constants/app";

export const isServer = typeof window === "undefined";

export const isProd = APP_ENV === "production";

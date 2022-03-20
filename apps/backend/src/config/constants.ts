import * as dotenv from "dotenv";

dotenv.config();

export const PORT: string = process.env.PORT!;
export const CLIENT_ROOT: string = process.env.CLIENT_ROOT!;
export const SERVER_ROOT: string = process.env.SERVER_ROOT!;
export const BASE_DOMAIN: string = process.env.BASE_DOMAIN!;
export const NODE_ENV: string = process.env.NODE_ENV!;
export const COOKIE_SIGN_KEY: string = process.env.COOKIE_SIGN_KEY!;

import * as dotenv from "dotenv";

dotenv.config();

export const PORT: string = process.env.PORT!;
export const CLIENT_ROOT: string = process.env.CLIENT_ROOT!;
export const SERVER_ROOT: string = process.env.SERVER_ROOT!;
export const BASE_DOMAIN: string = process.env.BASE_DOMAIN!;
export const NODE_ENV: string = process.env.NODE_ENV!;
export const COOKIE_SECRET: string = process.env.COOKIE_SECRET!;
export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;
export const UPLOADS_PATH: string = process.env.UPLOADS_PATH!;

import * as dotenv from 'dotenv';

dotenv.config();

export const PORT: string = process.env.PORT!;
export const CLIENT_ROOT: string = process.env.CLIENT_ROOT!;
export const SERVER_ROOT: string = process.env.SERVER_ROOT!;
export const BASE_DOMAIN: string = process.env.BASE_DOMAIN!;
export const NODE_ENV: string = process.env.NODE_ENV!;
export const COOKIE_SECRET: string = process.env.COOKIE_SECRET!;
export const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;
export const AWS_REGION: string = process.env.AWS_REGION!;
export const AWS_ACCESS_KEY: string = process.env.AWS_ACCESS_KEY!;
export const AWS_SECRET_KEY: string = process.env.AWS_SECRET_KEY!;
export const THEGRAPH_ENDPOINT: string = process.env.THEGRAPH_ENDPOINT!;
export const MEDIA_SERVER_URL: string = process.env.MEDIA_SERVER_URL!;
export const COINMARKETCAP_API_KEY: string = process.env.COINMARKETCAP_API_KEY!;

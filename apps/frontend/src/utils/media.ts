import { ASSETS_BASEURL } from "lib/constants/app";

export const getAssetUrl = (uri: string) => `${ASSETS_BASEURL}${uri}`;

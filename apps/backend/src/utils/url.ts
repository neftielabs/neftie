import { config } from "config/main";

export enum MediaTypes {
  avatar = "u/avatars",
  banner = "u/banners",
}

export function getMediaUrl(uri: string): string;
export function getMediaUrl(uri: string | null): string | null;
export function getMediaUrl(uri: string | null): string | null {
  return uri ? `${config.roots.media}/${uri}` : null;
}

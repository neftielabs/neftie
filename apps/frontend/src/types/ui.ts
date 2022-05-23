export type HeaderTheme = "transparent" | "solid";

export const allowedProfileTabs = [
  "work",
  "about",
  "reviews",
  "listings",
] as const;
export type ProfileTabs = typeof allowedProfileTabs[number];

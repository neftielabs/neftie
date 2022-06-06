import type { UploadedFile } from "express-fileupload";
import parseUrl from "parse-url";
import type { Asserts } from "yup";

import type { UserSafe, meSchema } from "@neftie/common";
import { isValidAddress, range } from "@neftie/common";
import type { User } from "@neftie/prisma";
import { userProvider } from "api/providers";
import AppError from "errors/AppError";
import { mediaBucket } from "modules/aws/s3-instances";
import Log from "modules/Log";
import type { Result } from "types/helpers";
import { isImage } from "utils/file";
import { getMediaUrl } from "utils/url";

/**
 * Transforms a user object into a client-safe one
 * without any sensitive data.
 */
export const toSafeUser = (user: User): UserSafe => {
  const { id, name, username, avatarUri, bannerUri, createdAt, verified } =
    user;

  const avatarUrl = getMediaUrl(avatarUri);
  const bannerUrl = bannerUri && getMediaUrl(bannerUri);

  return {
    id,
    name,
    verified,
    username,
    avatarUrl,
    bannerUrl,
    createdAt,
  };
};

/**
 * Generates a username based on the first 4 digits of an address (0x3f for example).
 * If that username already exists, appends a counter to the generated id (0x3f.01).
 */
export const generateUsername = async (address: string) => {
  const currentCount = 1;

  if (!isValidAddress) {
    throw new AppError("Invalid address", 500);
  }

  let id = address.slice(0, 4).toLowerCase();

  while ((await userProvider.getById(id)) !== null) {
    let separator = "";
    if (currentCount > 1) {
      separator = ".";
    }

    id += separator + String(currentCount).padStart(2, "0");
  }

  return id;
};

/**
 * Picks a random default avatar and returns its url.
 * Right now there are only 5 avatars.
 */
export const getDefaultAvatarUri = () => `u/avatars/default_${range(1, 5)}.jpg`;

/**
 * Given an address, look up if there's any
 * user or create a new user.
 */
export const registerUser = async (id: string) => {
  const user = await userProvider.getById(id);

  if (user) {
    return user;
  }

  const username = await generateUsername(id);

  return await userProvider.create({
    id,
    username,
    avatarUri: getDefaultAvatarUri(),
  });
};

/**
 * Handles profile avatar and banner uploads.
 */
export const handleProfileUpload = async (data: {
  userId: string;
  file: UploadedFile;
  entity: "avatar" | "banner";
}) => {
  const { userId, file, entity } = data;

  const user = await userProvider.getById(userId);
  if (!user) {
    return null;
  }

  const isImageResult = isImage(file);
  if (!isImageResult.success) {
    return null;
  }

  const previousAssetKey = `${entity}Uri` as const;
  const previousAsset = user[previousAssetKey];

  try {
    const result = await mediaBucket.upload({
      file: file.data,
      directory: `u/${entity}s`,
      extension: isImageResult.data.extension,
      previousFile: previousAsset || undefined,
    });

    if (result) {
      await userProvider.update(user.id, {
        [previousAssetKey]: result.key,
      });

      return true;
    }
  } catch (error) {
    new Log("userService", "handleProfileUpload").all(error);
  }

  return null;
};

/**
 * Update profile data
 */
export const updateProfile = async (data: {
  userId: string;
  body: Asserts<ReturnType<typeof meSchema["editProfile"]>>;
}): Promise<Result> => {
  const { userId, body } = data;

  const user = await userProvider.getById(userId);

  if (!user) {
    return {
      success: false,
    };
  }

  let websiteUrl = body.website;

  if (websiteUrl) {
    try {
      const parsedUrl = parseUrl(websiteUrl);
      websiteUrl = parsedUrl.resource || parsedUrl.pathname || undefined;
    } catch {}
  }

  try {
    await userProvider.update(userId, {
      username: body.username || user.username,
      name: body.name || user.name,
      twitterHandle: body.twitter || user.twitterHandle,
      websiteUrl:
        body.website?.replace(/((http|https):\/\/)/g, "") || user.websiteUrl,
      location: body.location || user.location,
      bio: body.bio?.split("\n\n\n").join("") || user.bio,
    });

    return {
      success: true,
    };
  } catch {}

  return {
    success: false,
  };
};

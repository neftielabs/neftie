import { UserSafe, range, typedObjectKeys } from "@neftie/common";
import { User } from "@neftie/prisma";
import { userProvider } from "api/providers";
import { UploadedFile } from "express-fileupload";
import { mediaBucket } from "modules/aws/s3-instances";
import { withLog } from "modules/Log";
import usernames from "resources/misc/usernames.json";
import { isImage } from "utils/file";

/**
 * Transforms a user object into a client-safe one
 * without any sensitive data.
 */
export const toSafeUser = (user: User): UserSafe => {
  const { address, name, username, avatarUrl, bannerUrl } = user;

  return {
    address,
    name,
    username,
    avatar: { url: avatarUrl },
    banner: { url: bannerUrl },
  };
};

/**
 * Generates a random username by picking
 * two words from random dictionaries and checking
 * that it doesn't already exist.
 *
 * "grizzled" + "crimson" = "grizzled_crimson"
 *
 * Wordlist taken from {@link https://github.com/cupcakearmy/canihazusername},
 * MIT licensed.
 */
export const generateRandomUsername = async () => {
  const randomIndex = (k: any[]) => (k.length * Math.random()) << 0;

  const generate = () => {
    const keys = typedObjectKeys(usernames);
    const firstKey = keys[randomIndex(keys)];
    let secondKey = firstKey;

    while (secondKey === firstKey) {
      secondKey = keys[randomIndex(keys)];
    }

    return [firstKey, secondKey]
      .map((k) => usernames[k][randomIndex(usernames[k])])
      .join("_")
      .toLowerCase();
  };

  let username = generate();

  while ((await userProvider.getByUsername(username)) !== null) {
    username = generate();
  }

  return username;
};

/**
 * Picks a random default avatar and returns its url.
 * Right now there are only 5 avatars.
 */
export const getRandomDefaultAvatar = () =>
  `/avatars/default_${range(1, 5)}.jpg`;

/**
 * Given an address, look up if there's any
 * user or create a new one.
 */
export const registerUser = async (address: string) => {
  const user = await userProvider.getByAddress(address);

  if (user) {
    return user;
  }

  return await userProvider.create({
    address,
    username: await generateRandomUsername(),
    avatarUrl: getRandomDefaultAvatar(),
  });
};

/**
 * Get a user either by id, address or username and
 * in a client-safe format.
 */
export async function getUser(data: {
  address: string;
}): Promise<UserSafe | null>;
export async function getUser(data: {
  userId: string;
}): Promise<UserSafe | null>;
export async function getUser(data: {
  username: string;
}): Promise<UserSafe | null>;
export async function getUser(
  data:
    | { userId: string; address?: undefined; username?: undefined }
    | { userId?: undefined; address: string; username?: undefined }
    | { userId?: undefined; address?: undefined; username: string }
): Promise<UserSafe | null> {
  let user: User | null = null;

  if (data.userId) {
    user = await userProvider.getById(data.userId);
  } else if (data.address) {
    user = await userProvider.getByAddress(data.address);
  } else if (data.username) {
    user = await userProvider.getByUsername(data.username);
  }

  if (!user) {
    return null;
  }

  return toSafeUser(user);
}

/**
 * Handles profile avatar and banner uploads.
 */
export const handleProfileUpload = withLog(
  async (
    log,
    data: {
      userId: string;
      file: UploadedFile;
      entity: "avatar" | "banner";
    }
  ) => {
    log.setTargets("userService", "handleProfileUpload");

    const { userId, file, entity } = data;

    const user = await userProvider.getById(userId);
    if (!user) {
      return null;
    }

    const isImageResult = isImage(file.name);
    if (!isImageResult.success) {
      return null;
    }

    const previousAssetKey = `${entity}Url` as const;
    const previousAsset = user[previousAssetKey];

    try {
      const result = await mediaBucket.upload({
        file: file.data,
        directory: `u/${entity}s`,
        extension: isImageResult.extension,
        previousFile: previousAsset || undefined,
      });

      if (result) {
        await userProvider.update(user.id, {
          [previousAssetKey]: result.key,
        });

        return true;
      }
    } catch (error) {
      log.all(error);
    }

    return null;
  }
);

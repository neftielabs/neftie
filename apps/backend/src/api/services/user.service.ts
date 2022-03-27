import { UserSafe } from "@neftie/common";
import { User } from "@neftie/prisma";
import { userProvider } from "api/providers";
import { pick } from "utils/pick";

/**
 * Transforms a user object into a client-safe one
 * without any sensitive data.
 */
export const toSafeUser = (user: User): UserSafe =>
  pick(user, ["id", "name", "publicKey"]);

/**
 * Given a public key, look up if there's any
 * user or create a new one.
 */
export const registerUser = async (publicKey: string): Promise<UserSafe> => {
  const user = await userProvider.getByPublicKey(publicKey);

  if (user) {
    return toSafeUser(user);
  }

  return await userProvider.create({ publicKey });
};

/**
 * Get a user either by id or publickey and
 * in a client-safe format.
 */
export async function getSafeUser(data: {
  publicKey: string;
}): Promise<UserSafe | null>;
export async function getSafeUser(data: {
  userId: string;
}): Promise<UserSafe | null>;
export async function getSafeUser(
  data:
    | { userId: string; publicKey?: undefined }
    | { userId?: undefined; publicKey: string }
): Promise<UserSafe | null> {
  if (data.userId) {
    const user = await userProvider.getById(data.userId);

    if (user) {
      return toSafeUser(user);
    }
  } else if (data.publicKey) {
    const user = await userProvider.getByPublicKey(data.publicKey);

    if (user) {
      return toSafeUser(user);
    }
  }

  return null;
}

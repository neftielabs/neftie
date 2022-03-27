import { User } from "@neftie/prisma";

export type UserSafe = Pick<User, "id" | "publicKey" | "name">;

import { randomBytes } from "crypto";

export const generateRandomString = (size = 32) =>
  randomBytes(size).toString("hex");

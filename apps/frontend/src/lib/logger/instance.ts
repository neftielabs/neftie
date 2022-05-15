import { Logger } from "lib/logger/logger";
import { isProd } from "utils/app";

export const logger = new Logger({
  level: isProd ? "warn" : "debug",
  colors: {
    debug: "#7f69ec",
    info: "blue",
    warn: "orange",
    error: "red",
  },
  timestamps: true,
  showLevel: true,
});

import path from "path";
import { isProd } from "utils/constants";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const commonFileOptions = {
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "10d",
  dirname: path.join(__dirname, "../../../logs"),
  format: winston.format.json({ space: 2 }),
};

/**
 * Allow transports to log one level only
 * instead of following the common winston pattern
 * of logging everything from the level specified upwards
 */
const filterLevels = (level: string[]) =>
  winston.format((info) => {
    return level.includes(info.level) ? info : false;
  });

/**
 * File transport to log unhandled exceptions
 */
export const exceptionHandler = new DailyRotateFile({
  ...commonFileOptions,
  filename: "unhandled-exceptions-%DATE%.log",
});

/**
 * File transport to log http requests only
 */
export const http = new DailyRotateFile({
  ...commonFileOptions,
  maxSize: "128m",
  filename: "http-%DATE%.log",
  level: "http",
  format: winston.format.combine(
    filterLevels(["http"])(),
    commonFileOptions.format
  ),
});

/**
 * File transport to log warn and error levels
 */
export const error = new DailyRotateFile({
  ...commonFileOptions,
  filename: "error-%DATE%.log",
  level: "warn",
});

/**
 * File transport to log debug and info levels
 */
export const info = new DailyRotateFile({
  ...commonFileOptions,
  filename: "info-%DATE%.log",
  level: "debug",
  format: winston.format.combine(
    filterLevels(["debug", "info"])(),
    commonFileOptions.format
  ),
});

/**
 * File transport to log database queries
 */
export const db = new DailyRotateFile({
  ...commonFileOptions,
  filename: "db-%DATE%.log",
  level: "db",
  format: winston.format.combine(
    filterLevels(["db"])(),
    commonFileOptions.format
  ),
});

/**
 * File transport with all logs combined
 */
export const all = new DailyRotateFile({
  ...commonFileOptions,
  filename: "all-%DATE%.log",
  maxSize: "256mb",
});

/**
 * Console transport
 */
export const consoleCommon = new winston.transports.Console({
  format: winston.format.combine(
    ...(isProd
      ? [
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.colorize({ level: true }),
          winston.format.printf(
            (msg) => `[${msg.timestamp}] ${msg.level}: ${msg.message}`
          ),
        ]
      : [
          winston.format.splat(),
          winston.format.padLevels(),
          winston.format.colorize({ level: true }),
          winston.format.timestamp({ format: "HH:mm:ss" }),
          winston.format.printf(
            (msg) => `[${msg.timestamp}] ${msg.level}: ${msg.message}`
          ),
        ])
  ),
});

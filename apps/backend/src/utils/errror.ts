import AppError from "errors/AppError";
import httpStatus from "http-status";
import { waitForWinston } from "modules/Logger/Logger";

/**
 * Stops the app
 */
export const exitProcess = async (code = 1) => {
  await waitForWinston();
  // eslint-disable-next-line no-process-exit
  process.exit(code);
};

/**
 * Attempts to convert errors to trusted ones
 *
 * @param err - Error to be converted
 * @returns The converted error
 */
export const convertToSafeError = (err: AppError | Error): AppError => {
  if (err instanceof AppError) return err;

  // Return 500

  return new AppError(
    "Something went wrong processing your request",
    httpStatus.INTERNAL_SERVER_ERROR
  );
};

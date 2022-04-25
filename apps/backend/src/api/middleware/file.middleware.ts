import fileUpload from "express-fileupload";
import { Middleware } from "typera-express";

/**
 * Generic file upload middleware.
 * Uses express-fileupload under the hood and accepts
 * options that will override the defaults.
 */
export const generic = (options?: fileUpload.Options) =>
  Middleware.wrapNative(
    fileUpload({
      limits: { fileSize: 15 * 1024 * 1024 },
      abortOnLimit: true,
      ...options,
    })
  );

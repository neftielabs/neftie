import { config } from "config/main";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs/promises";
import { cryptoService } from "api/services";
import { stripHostFromUpload } from "utils/file";

/**
 * Store file uploads in the filesystem.
 *
 // #todo move to s3 when feasible
 */
export const writeUpload = async (
  file: fileUpload.UploadedFile,
  extension: string,
  customFilename?: string,
  extraPath = "",
  previousFile: string | null = ""
) => {
  const filename = `${
    customFilename || cryptoService.generateRandomString(16)
  }.${extension}`;
  const destination = path.join(
    __dirname,
    "../../../",
    config.files.uploadsPath,
    extraPath,
    filename
  );

  await fs.writeFile(destination, file.data);

  if (previousFile) {
    try {
      await fs.rm(
        path.join(
          __dirname,
          "../../../public",
          stripHostFromUpload(previousFile)
        )
      );
    } catch {}
  }

  return `${config.roots.server}/uploads/${
    extraPath ? extraPath + "/" : ""
  }${filename}`;
};

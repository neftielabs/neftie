import path from "path";

import type { UploadedFile } from "express-fileupload";

import type { Result } from "types/helpers";

export const isImage = (file?: UploadedFile): Result<{ extension: string }> => {
  if (!file) {
    return {
      success: false,
    };
  }

  const extension = path.extname(file.name);

  if (!extension || ["jpg", "jpeg", "gif", "png"].includes(extension)) {
    return {
      success: false,
    };
  }

  if (!file.mimetype.includes("image")) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    data: { extension },
  };
};

export const isValidSingleFile = (
  file: UploadedFile | UploadedFile[] | undefined,
  size: number
): file is UploadedFile => {
  return !!file && !Array.isArray(file) && file.size <= size && !file.truncated;
};

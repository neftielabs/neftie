import { UploadedFile } from "express-fileupload";
import path from "path";

export const isImage = (filename: string) => {
  const extension = path.extname(filename);

  if (!extension || ["jpg", "jpeg", "gif", "png"].includes(extension)) {
    return {
      success: false,
      extension,
    };
  }

  return {
    success: true,
    extension,
  };
};

export const isValidSingleFile = (
  file: UploadedFile | UploadedFile[] | undefined,
  size: number
): file is UploadedFile => {
  return !!file && !Array.isArray(file) && file.size <= size && !file.truncated;
};

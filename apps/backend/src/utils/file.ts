import { config } from "config/main";

export const stripExtension = (filename: string) => {
  const lastIndex = filename.lastIndexOf(".");

  if (lastIndex === -1) {
    return null;
  }

  return filename.slice(lastIndex + 1);
};

export const isImageExtension = (extension: string) =>
  ["jpg", "jpeg", "gif", "png"].includes(extension);

export const stripHostFromUpload = (filename: string) =>
  filename.replace(config.roots.server, "");

import type { Readable } from "stream";

export type S3ObjectType = Readable | Blob | string | Uint8Array | Buffer;

type S3UploadBody =
  | {
      path: string;
      extension?: string;
    }
  | {
      extension: string;
      file: S3ObjectType;
    };

export type S3UploadParams = S3UploadBody & {
  previousFile?: string;
  directory?: string;
};

export type S3FilenameParams = { directory?: string } & (
  | {
      extension?: string;
      path: string;
    }
  | {
      extension: string;
    }
);

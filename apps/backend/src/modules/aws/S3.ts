import fs from "fs";
import path from "path";

import type { PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { cryptoService } from "api/services";
import { config } from "config/main";
import Log from "modules/Log";
import logger from "modules/Logger/Logger";
import type { S3FilenameParams, S3ObjectType, S3UploadParams } from "types/s3";

/**
 * Wrapper over the AWS S3 SDK for easy uploads
 * and retrievals
 */

export default class S3 {
  /**
   * The S3 instance
   */
  public s3: S3Client;

  /**
   * Bucket name to interact with
   */
  private bucket: string;

  /**
   * Preconfigured logging instance
   */
  private log: Log;

  /**
   * AWS configuration object
   */
  private config = config.external.aws;

  /**
   * @param bucket - The bucket name to interact with
   */
  constructor(s3: S3Client, bucket: string) {
    this.s3 = s3;
    this.bucket = bucket;

    this.log = new Log();
    this.log.setTargetSection("AWS S3");
  }

  /**
   * Generate a file name with the format
   * `<directory>/<date ms>-<random bytes>.<extension>`
   */
  private generateFilename(data: S3FilenameParams) {
    const { directory = "" } = data;
    const filename = `${Date.now()}-${cryptoService.generateRandomString(8)}`;
    let extension = "";

    if ("path" in data) {
      extension = path.extname(data.path);
    } else {
      extension = data.extension;
    }

    if (extension.startsWith(".")) {
      extension = extension.slice(1);
    }

    return path.join(directory, `${filename}.${extension}`);
  }

  /**
   * @returns Shared configuration for all objects
   * in all buckets
   */
  private getUploadParams(): Partial<PutObjectCommandInput> {
    return {
      CacheControl: "max-age=2592000", // 30 days in seconds
    };
  }

  /**
   * Deletes an object from a bucket.
   */
  public async delete(key: string) {
    logger.debug(`[S3] Deleting object '${key}' in '${this.bucket}'`);

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );

      return true;
    } catch (error) {
      this.log.all(error);
      return false;
    }
  }

  /**
   * Upload an object to the given bucket.
   * Either the file contents or path can be and filenames cannot be specified
   * to avoid collisions.
   */
  public async upload(data: S3UploadParams) {
    this.log.setTargetElement("upload");

    let filename = "";
    let content: S3ObjectType | null = null;

    if ("path" in data) {
      content = fs.createReadStream(data.path);
      filename = this.generateFilename({
        directory: data.directory,
        path: data.path,
        extension: data.extension,
      });
    } else {
      content = data.file;
      filename = this.generateFilename({
        directory: data.directory,
        extension: data.extension,
      });
    }

    try {
      logger.debug(`[S3] Creating object '${filename}' in '${this.bucket}'`);

      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Body: content,
          Key: filename,
          ...this.getUploadParams(),
        })
      );

      if (data.previousFile) {
        await this.delete(data.previousFile);
      }

      return {
        bucket: this.bucket,
        key: filename,
      };
    } catch (error) {
      this.log.all(error);
      return null;
    }
  }
}

import { S3Client } from "@aws-sdk/client-s3";
import { config } from "config/main";
import S3 from "modules/aws/S3";

const client = new S3Client({
  region: config.external.aws.region,
  credentials: config.external.aws.credentials,
});

/**
 * Bucket where all user media is stored
 */
export const mediaBucket = new S3(client, "media.neftie.io");

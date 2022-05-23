import { captureException, withSentry } from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Route config
 */
export const config = {
  api: {
    externalResolver: true,
  },
};

/**
 * Where requests will be sent.
 */
const sentryHost = "sentry.io";

/**
 * List of allowed Sentry projects.
 */
const knownProjectIds = [process.env.SENTRY_PROJECT_ID];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const envelope = req.body;
    const pieces = envelope.split("\n");

    const header = JSON.parse(pieces[0]);

    const url = new URL(header.dsn);
    const host = url.host.split(".").slice(2).join(".");

    if (host !== sentryHost) {
      throw new Error(`invalid host: ${host}`);
    }

    const path = url.pathname;

    const projectId = path?.startsWith("/") ? path.slice(1) : path;
    if (!projectId || !knownProjectIds.includes(projectId)) {
      throw new Error(`invalid project id: ${projectId}`);
    }

    const requestUrl = `https://${sentryHost}/api/${projectId}/envelope/`;

    await fetch(requestUrl, {
      method: "POST",
      body: envelope,
    });

    return res.status(200).json({});
  } catch (error) {
    captureException(error);
    return res.status(400).json({ status: "bad request" });
  }
};

export default withSentry(handler);

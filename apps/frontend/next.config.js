// eslint-disable-next-line tsdoc/syntax

const { withSentryConfig } = require("@sentry/nextjs");

const isProd = process.env.NODE_ENV === "production";

const envLoaded = process.env.NEXT_PUBLIC_ENV_TEST;

console.log({ envLoaded });

const withBundleAnalyzer = isProd
  ? null
  : require("@next/bundle-analyzer")({
      enabled: process.env.ANALYZE === "true",
    });

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  images: {
    domains: [
      "images.unsplash.com",
      "localhost",
      "i.imgur.com",
      "media.neftie.io",
    ],
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = isProd
  ? withSentryConfig(baseConfig, sentryWebpackPluginOptions)
  : withSentryConfig(
      withBundleAnalyzer(baseConfig),
      sentryWebpackPluginOptions
    );

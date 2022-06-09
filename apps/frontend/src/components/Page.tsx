import React from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import { Footer } from "components/footers/Footer";
import { Header } from "components/headers/Header";
import { APP_URL } from "lib/constants/app";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE_URL,
} from "lib/constants/seo";

export interface PageProps {
  title?: string;
  description?: string;
  image?: string;
}

export const Page: React.FC<PageProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = OG_IMAGE_URL,
  children,
}) => {
  const { asPath } = useRouter();
  const pageTitle = title ? `${title} | neftie` : DEFAULT_TITLE;

  const url = `${APP_URL}${!asPath || asPath === "/" ? "" : asPath}`;
  const ogImage = `https://sixty-friends-send-83-40-59-127.loca.lt/og-image.jpg`;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>{pageTitle}</title>

        {[
          { name: "title", content: pageTitle },
          { name: "description", content: description },
          { property: "og:title", content: pageTitle },
          { property: "og:url", content: url },
          { property: "og:description", content: description },
          { property: "og:image", content: ogImage },
          { property: "og:image:url", content: ogImage },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: pageTitle },
          { name: "twitter:site", content: "@neftielabs" },
          { name: "twitter:url", content: url },
          { name: "twitter:image", content: ogImage },
        ]
          .filter((tag) => !!tag)
          .map((tag) => (
            <meta {...tag} key={tag.name ?? tag.property} />
          ))}

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
};

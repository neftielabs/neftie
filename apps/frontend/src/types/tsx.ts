import type React from "react";

import type {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import type { AppProps } from "next/app";

export type PageComponent<
  T extends GetServerSideProps | GetStaticProps | { [key: string]: any }
> = NextPage<
  T extends GetServerSideProps
    ? InferGetServerSidePropsType<T>
    : T extends GetStaticProps
    ? InferGetStaticPropsType<T>
    : T
> & {
  requiresAuth?: boolean;
  noWebSocket?: boolean;
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: PageComponent<any>;
};

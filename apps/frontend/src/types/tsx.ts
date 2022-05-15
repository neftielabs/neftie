import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { AppProps } from "next/app";
import React from "react";

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
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: PageComponent<any>;
};

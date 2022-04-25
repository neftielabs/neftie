import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
} from "next";

export type PageComponent<
  T extends GetServerSideProps | GetStaticProps | { [key: string]: any }
> = NextPage<
  T extends GetServerSideProps
    ? InferGetServerSidePropsType<T>
    : T extends GetStaticProps
    ? InferGetStaticPropsType<T>
    : T
> & { requiresAuth?: boolean };

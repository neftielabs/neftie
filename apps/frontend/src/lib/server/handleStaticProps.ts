import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";

/**
 * Wrapper function for GetStaticProps.
 * Helps by merging both specified props and returned props and
 * to correctly infer the props type, since InferGetStaticPropsType<T>
 * doesn't work if one returns notFound
 */
export const handleStaticProps =
  <T>(getStaticPropsFunc: GetStaticProps<T>) =>
  async (
    ctx: GetStaticPropsContext
  ): Promise<
    GetStaticPropsResult<{
      serverProps: NonNullable<T> extends never ? null : NonNullable<T>;
    }>
  > => {
    const staticPropsResult = await getStaticPropsFunc(ctx);

    if ("redirect" in staticPropsResult || "notFound" in staticPropsResult) {
      return staticPropsResult;
    }

    return {
      revalidate: staticPropsResult.revalidate,
      props: {
        serverProps: staticPropsResult.props as any,
      },
    };
  };

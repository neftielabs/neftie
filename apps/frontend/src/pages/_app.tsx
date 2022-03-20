import { queryClient } from "lib/queryClient";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import styles from "styles/globalStyles";

const App = ({ Component, pageProps }: AppProps) => {
  styles();

  const { asPath } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      <Component {...pageProps} key={asPath} />
    </QueryClientProvider>
  );
};

export default App;

import { AuthProvider } from "context/AuthProvider";
import { ModalProvider } from "context/ModalProvider";
import { queryClient } from "lib/http/queryClient";
import { connectors, getDefaultProvider } from "lib/web3/providers";
import { Router, useRouter } from "next/router";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import styles from "styles/globalStyles";
import { WagmiProvider } from "wagmi";
import nProgress from "nprogress";

import "styles/nprogress.css";
import { AppPropsWithLayout } from "types/tsx";

// nprogress

nProgress.configure({
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  styles();
  const { asPath } = useRouter();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider
        autoConnect
        connectors={connectors}
        provider={getDefaultProvider}
      >
        <AuthProvider requiresAuth={!!Component.requiresAuth}>
          <ModalProvider>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            {getLayout(<Component {...pageProps} key={asPath} />)}
          </ModalProvider>
        </AuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default App;

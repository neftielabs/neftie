import { Router } from "next/router";
import nProgress from "nprogress";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { WagmiConfig } from "wagmi";

import { Toast } from "components/ui/Toast";
import { AuthProvider } from "context/AuthProvider";
import { ModalProvider } from "context/ModalProvider";
import { WebSocketProvider } from "context/WebSocketProvider";
import { queryClient } from "lib/http/queryClient";
import { wagmiClient } from "lib/web3/wagmi";
import styles from "styles/globalStyles";
import type { AppPropsWithLayout } from "types/tsx";

import "styles/nprogress.css";
import "react-loading-skeleton/dist/skeleton.css";
import "draft-js/dist/Draft.css";

// nprogress

nProgress.configure({
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  styles();

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <WebSocketProvider noWebSocket={!!Component.noWebSocket}>
          <AuthProvider requiresAuth={!!Component.requiresAuth}>
            <ModalProvider modals={Component.modals || []}>
              <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom-right"
              />
              {getLayout(<Component {...pageProps} />)}
              <Toast />
            </ModalProvider>
          </AuthProvider>
        </WebSocketProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default App;

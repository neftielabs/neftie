import { AuthProvider } from "context/AuthProvider";
import { ModalProvider } from "context/ModalProvider";
import { queryClient } from "lib/queryClient";
import { connectors, getDefaultProvider } from "lib/web3/providers";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import styles from "styles/globalStyles";
import { WagmiProvider } from "wagmi";

const App = ({ Component, pageProps }: AppProps) => {
  styles();
  const { asPath } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider
        autoConnect
        connectors={connectors}
        provider={getDefaultProvider}
      >
        <AuthProvider requiresAuth={false}>
          <ModalProvider>
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
            <Component {...pageProps} key={asPath} />
          </ModalProvider>
        </AuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default App;

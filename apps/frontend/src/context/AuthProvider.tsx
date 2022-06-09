import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

import { areAddressesEqual } from "@neftie/common";
import { WaitForAuth } from "components/layout/WaitForAuth";
import { useTypedMutation } from "hooks/http/useTypedMutation";
import { useToken } from "hooks/useToken";
import { useWallet } from "hooks/useWallet";
import { logger } from "lib/logger/instance";
import { routes } from "lib/manifests/routes";
import { isTruthy, someTrue } from "utils/fp";

export const AuthContext = React.createContext<{
  isAuthLoading: boolean;
  isAuthed: boolean;
  connectedAddress: string | undefined;
  disconnect: () => Promise<void>;
  connect: () => Promise<void>;
}>({
  isAuthLoading: false,
  isAuthed: false,
  connectedAddress: undefined,
  disconnect: async () => {},
  connect: async () => {},
});

interface AuthProviderProps {
  requiresAuth: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  requiresAuth,
  children,
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [token, { setToken }] = useToken();
  const [isWalletLoading] = useWallet();
  const { disconnect: disconnectWallet } = useDisconnect();

  const queryClient = useQueryClient();
  const { mutateAsync: getToken } = useTypedMutation("getAuthToken");
  const { mutateAsync: disconnect } = useTypedMutation("disconnect");

  const { data: accountData } = useAccount();
  const { activeChain } = useNetwork();

  const router = useRouter();

  /**
   * Redirect a user to the connect wallet page,
   * together with the intended path stored in the query params
   */
  const redirectToConnect = useCallback(() => {
    const redirect = routes.connectNext(window.location.pathname);
    router.replace(redirect);
  }, [router]);

  const logOut = useCallback(
    () =>
      disconnect([])
        .then(() => {
          setToken(null);
          disconnectWallet();
          queryClient.resetQueries();

          if (requiresAuth) {
            redirectToConnect();
          }
        })
        .catch(),
    [
      disconnect,
      disconnectWallet,
      queryClient,
      redirectToConnect,
      requiresAuth,
      setToken,
    ]
  );

  useEffect(() => {
    if (!token && accountData?.address && !isAuthenticating) {
      setIsAuthenticating(true);

      logger.debug("[Auth] Requesting /token");

      /**
       * If the call is successful and a token is returned,
       * this means that the user had a valid access token in their cookies.
       */
      getToken([])
        .then((result) => {
          /**
           * Check if the user received matches the current
           * connected wallet address
           */
          if (!areAddressesEqual(result.user.id, accountData?.address)) {
            logger.debug(`[Auth] Received address and connected mismatch`);
            logOut();
          } else {
            logger.debug("[Auth] Auth ok, storing token");
            queryClient.resetQueries();

            /**
             * All good to store the token in memory.
             * We store it together with the address in order
             * to be able to react to a wallet account change.
             */
            setToken({ value: result.token, address: result.user.id });
          }
        })
        .catch(() => {
          queryClient.resetQueries();

          if (requiresAuth) {
            logger.debug("[Auth] Auth error, and auth required");
            redirectToConnect();
          }
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    } else {
      setIsAuthenticating(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData?.address, requiresAuth, token]);

  useEffect(() => {
    if (
      token &&
      (token.address !== accountData?.address || activeChain?.unsupported) &&
      !isAuthenticating &&
      !isWalletLoading
    ) {
      logger.debug("[Auth] Accounts mismatch or wrong chain");
      logOut();
    }
  }, [
    accountData?.address,
    activeChain?.unsupported,
    isAuthenticating,
    isWalletLoading,
    logOut,
    queryClient,
    token,
  ]);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          isAuthLoading: someTrue([isWalletLoading, isAuthenticating]),
          isAuthed: isTruthy(token),
          connectedAddress: accountData?.address,
          connect: async () => {},
          disconnect: () => logOut(),
        }),
        [accountData?.address, isAuthenticating, isWalletLoading, logOut, token]
      )}
    >
      {requiresAuth ? (
        <WaitForAuth
          isAuthed={isTruthy(token)}
          isAuthLoading={someTrue([isWalletLoading, isAuthenticating])}
          redirectToConnect={redirectToConnect}
          requiresAuth={requiresAuth}
        >
          {children}
        </WaitForAuth>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

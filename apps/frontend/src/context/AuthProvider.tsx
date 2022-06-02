import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useAccount } from "wagmi";

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
  isAuthLoading: true,
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
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const [token, { setToken }] = useToken();
  const [isWalletLoading] = useWallet();

  const queryClient = useQueryClient();
  const { mutateAsync: getToken } = useTypedMutation("getAuthToken");
  const { mutateAsync: disconnect } = useTypedMutation("disconnect");

  const { data: accountData } = useAccount();

  const router = useRouter();

  /**
   * Redirect a user to the connect wallet page,
   * together with the intended path stored in the query params
   */
  const redirectToConnect = useCallback(() => {
    const redirect = routes.connectNext(window.location.pathname);
    router.replace(redirect);
  }, [router]);

  useEffect(() => {
    if (!token && accountData?.address) {
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

            /**
             * No match, call disconnect to clear current token in cookies
             * and stay logged out
             */
            disconnect([])
              .then(() => {
                queryClient.clear();

                if (requiresAuth) {
                  redirectToConnect();
                }
              })
              .catch();
          } else {
            logger.debug("[Auth] Auth ok, storing token");

            /**
             * All good to store the token in memory.
             * We store it together with the address in order
             * to be able to react to a wallet account change.
             */
            setToken({ value: result.token, address: result.user.id });
          }
        })
        .catch(() => {
          queryClient.clear();

          /**
           * If the current page requires auth, redirect to the
           * connect page and store the intended path in the query params
           */
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
  }, [accountData?.address]);

  useEffect(() => {
    if (
      token &&
      token.address !== accountData?.address &&
      !isAuthenticating &&
      !isWalletLoading
    ) {
      logger.debug("[Auth] Accounts mismatch");

      queryClient.clear();

      /**
       * Token address and current connected address don't match
       * clear all tokens (server & client)
       */
      disconnect([])
        .then(() => {
          setToken(null);

          if (requiresAuth) {
            redirectToConnect();
          }
        })
        .catch();
    }
  }, [
    accountData?.address,
    disconnect,
    isAuthenticating,
    isWalletLoading,
    queryClient,
    redirectToConnect,
    requiresAuth,
    setToken,
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
          disconnect: async () => {},
        }),
        [accountData?.address, isAuthenticating, isWalletLoading, token]
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

import React, { useEffect } from "react";
import { useConnect } from "wagmi";
import { useUserStore } from "stores/useUserStore";

interface AuthProviderProps {
  requiresAuth: boolean;
}

/**
 * Fetches the current user on page load/change
 * in case the wallet is connected and no user is
 * present in the store.
 *
 * If the wallet was to be disconnected and a user is
 * in store, we empty the user forcing to log in again.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser, hasFetched, isFetching, fetchUser, set] = useUserStore(
    (s) => [
      s.user,
      s.setUser,
      s.hasFetchedUser,
      s.isFetchingUser,
      s.fetchUser,
      s.set,
    ]
  );
  const [{ data: connectData }] = useConnect();

  useEffect(() => {
    if (!user && !isFetching && !hasFetched && connectData.connected) {
      fetchUser()
        .then((success) => {
          if (!success) {
            // @todo
            // If requiresAuth == true, redirect to some login page
          }
        })
        .catch(() => {
          // @todo
          // If requiresAuth == true, redirect to some login page
        });
    } else if (user && !connectData.connected) {
      setUser(null);
    }
  }, [
    connectData.connected,
    fetchUser,
    hasFetched,
    isFetching,
    set,
    setUser,
    user,
  ]);

  return <>{children}</>;
};

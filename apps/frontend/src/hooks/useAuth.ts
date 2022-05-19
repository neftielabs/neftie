import { useContext } from "react";

import { AuthContext } from "context/AuthProvider";

export const useAuth = (): [
  boolean,
  boolean,
  {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    connectedAddress: string | undefined;
  }
] => {
  const { isAuthLoading, isAuthed, connect, disconnect, connectedAddress } =
    useContext(AuthContext);

  return [isAuthed, isAuthLoading, { connect, disconnect, connectedAddress }];
};

import { AuthContext } from "context/AuthProvider";
import { useContext } from "react";

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

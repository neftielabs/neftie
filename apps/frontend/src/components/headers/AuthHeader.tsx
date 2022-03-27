import { ConnectWalletButton } from "components/buttons/ConnectWalletButton";
import { UserOverlay } from "components/overlays/user/UserOverlay";
import { useUser } from "hooks/useUser";
import React from "react";

interface AuthHeaderProps {}

export const AuthHeader: React.FC<AuthHeaderProps> = () => {
  const [user, isLoadingUser] = useUser();

  return (
    <>
      {user || isLoadingUser ? (
        <UserOverlay user={user} isLoading={isLoadingUser} />
      ) : (
        <ConnectWalletButton />
      )}
    </>
  );
};

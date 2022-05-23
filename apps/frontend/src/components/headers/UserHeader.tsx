import React from "react";

import { ConnectWalletButton } from "components/buttons/ConnectWalletButton";
import { UserOverlay } from "components/overlays/user/UserOverlay";
import { Button } from "components/ui/Button";
import { Link } from "components/ui/Link";
import { useGetUser } from "hooks/queries/useGetUser";
import { useAuth } from "hooks/useAuth";
import { routes } from "lib/manifests/routes";

interface UserHeaderProps {}

export const UserHeader: React.FC<UserHeaderProps> = () => {
  const { isAuthed, isAuthLoading } = useAuth();
  const { data: user } = useGetUser({
    from: { currentUser: true },
  });

  return (
    <>
      {isAuthed || isAuthLoading ? (
        <>
          <Link href={routes.create}>
            <Button
              size="sm"
              theme="gradientOrange"
              text="13"
              spring
              tw="h-3.5"
            >
              Create
            </Button>
          </Link>
          <UserOverlay user={user} isLoading={isAuthLoading} />
        </>
      ) : (
        <ConnectWalletButton />
      )}
    </>
  );
};

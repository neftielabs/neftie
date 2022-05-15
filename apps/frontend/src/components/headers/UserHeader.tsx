import { ConnectWalletButton } from "components/buttons/ConnectWalletButton";
import { UserOverlay } from "components/overlays/user/UserOverlay";
import { Button } from "components/ui/Button";
import { Link } from "components/ui/Link";
import { useGetUser } from "hooks/queries/useGetUser";
import { useAuth } from "hooks/useAuth";
import { routes } from "lib/manifests/routes";
import React from "react";

interface UserHeaderProps {}

export const UserHeader: React.FC<UserHeaderProps> = () => {
  const [isAuthed, isAuthLoading] = useAuth();
  const { user } = useGetUser({
    currentUser: true,
  });

  return (
    <>
      {isAuthed || isAuthLoading ? (
        <>
          <Link href={routes.create}>
            <Button size="sm" theme="gradient" text="13" spring tw="h-3.5">
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

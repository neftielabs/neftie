import { UserSafe } from "@neftie/common";
import { UserAvatar } from "components/overlays/user/UserAvatar";
import React from "react";

interface UserOverlayProps {
  user: UserSafe | null;
  isLoading: boolean;
}

export const UserOverlay: React.FC<UserOverlayProps> = ({
  user,
  isLoading,
}) => {
  return (
    <>
      <UserAvatar user={user} isLoading={isLoading} />
    </>
  );
};

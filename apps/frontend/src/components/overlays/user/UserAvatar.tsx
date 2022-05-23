import React from "react";

import { useDisconnect } from "wagmi";

import type { UserSafe } from "@neftie/common";
import { Avatar } from "components/media/Avatar";
import { Box } from "components/ui/Box";
import { Loader } from "components/ui/Loader";
import { styleUtils } from "utils/style";

interface UserAvatarProps {
  user?: UserSafe | null;
  isLoading?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  isLoading = false,
}) => {
  const { disconnect } = useDisconnect();

  return (
    <Box tw="rounded-full text-white relative" onClick={() => disconnect()}>
      <Avatar
        css={{ opacity: isLoading ? "0" : "1" }}
        avatarUrl={user?.avatarUrl}
      />

      {/* <Avatar
        avatarId={4}
        tw="transition-opacity"
        css={{ opacity: isLoading ? "0" : "1" }}
      /> */}
      <Loader
        tw="transition-opacity text-black"
        css={{ opacity: isLoading ? "1" : "0", ...styleUtils.center.xy }}
      />
    </Box>
  );
};

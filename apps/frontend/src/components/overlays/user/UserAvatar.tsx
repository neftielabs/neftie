import { UserSafe } from "@neftie/common";
import { Avatar } from "components/media/Avatar";

import { Box } from "components/ui/Box";
import { Loader } from "components/ui/Loader";
import React from "react";
import { styleUtils } from "utils/style";
import { useAccount } from "wagmi";

interface UserAvatarProps {
  user: UserSafe | null;
  isLoading?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  isLoading = false,
}) => {
  const [, disconnect] = useAccount();

  return (
    <Box tw="rounded-full text-white relative" onClick={() => disconnect()}>
      <Avatar
        css={{ opacity: isLoading ? "0" : "1" }}
        avatarUrl={user?.avatar.url}
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

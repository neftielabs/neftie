import { UserSafe } from "@neftie/common";
import { Avatar } from "components/assets/Avatar";
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
    <Box
      tw="rounded-full text-white shadow-lg relative border-0.3 border-white"
      onClick={() => disconnect()}
    >
      <Avatar
        avatarId={4}
        tw="transition-opacity"
        css={{ opacity: isLoading ? "0" : "1" }}
      />
      <Loader
        tw="transition-opacity text-black"
        css={{ opacity: isLoading ? "1" : "0", ...styleUtils.center.xy }}
      />
    </Box>
  );
};

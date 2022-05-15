import { UserSafe } from "@neftie/common";
import { UserAvatar } from "components/overlays/user/UserAvatar";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { routes } from "lib/manifests/routes";
import React, { useState } from "react";
import { styled } from "stitches.config";
import tw from "twin.macro";

const OverlayWrapper = styled(Box, {
  ...tw`bg-white rounded-12 shadow-lg
  absolute top-full right-0 z-10 transform -translate-y-2.5
  opacity-0 invisible overflow-hidden border border-gray-100`,
  minWidth: 250,
  variants: {
    visible: {
      true: {
        ...tw`opacity-100 visible translate-y-0`,
        transition: "opacity .2s, visibility 0s, transform .25s ease",
      },
      false: {
        transition:
          "opacity .2s, visibility 0s linear .2s, transform .25s ease",
      },
    },
  },
  defaultVariants: {
    visible: false,
  },
});

interface UserOverlayProps {
  user?: UserSafe | null;
  isLoading: boolean;
}

export const UserOverlay: React.FC<UserOverlayProps> = ({
  user,
  isLoading,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Box
      tw="relative py-1"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <UserAvatar user={user} isLoading={isLoading} />
      <OverlayWrapper visible={visible}>
        <Button raw tw="py-2 px-2 hover:bg-gray-50 w-full text-left">
          <Link href={user?.address ? routes.user(user.address).index : ""}>
            <Text weight="bold" color="gray600">
              Profile
            </Text>
          </Link>
        </Button>
      </OverlayWrapper>
    </Box>
  );
};

import React, { useRef } from "react";

import type { UserSafe } from "@neftie/common";
import { CopyButton } from "components/buttons/CopyButton";
import { Avatar } from "components/media/Avatar";
import { Banner } from "components/media/Banner";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { User } from "components/users/User";
import { queryClient } from "lib/http/queryClient";
import { handleProfileAssetUpload } from "lib/user";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";
import { onlyTrue } from "utils/fp";
import { shortenAddress } from "utils/web3";

interface ProfileHeaderProps {
  user: UserSafe;
  isCurrentUser: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isCurrentUser,
}) => {
  const { setActiveModal } = useModalStore();

  const uploadBannerRef = useRef<HTMLInputElement>(null);
  const uploadAvatarRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/jpg,image/jpeg,image/png,image/gif"
        ref={uploadBannerRef}
        tw="hidden"
        onChange={(ev) =>
          handleProfileAssetUpload(ev, "banner").then(() =>
            queryClient.refetchQueries("getUser")
          )
        }
      />

      <input
        type="file"
        accept="image/jpg,image/jpeg,image/png,image/gif"
        ref={uploadAvatarRef}
        tw="hidden"
        onChange={(ev) =>
          handleProfileAssetUpload(ev, "avatar").then(() =>
            queryClient.refetchQueries("getUser")
          )
        }
      />

      <Banner
        imageUrl={user.bannerUrl}
        tw="h-30"
        edit={onlyTrue({
          onClick: () => uploadBannerRef.current?.click(),
          buttonText: user.bannerUrl ? "Change banner" : "Add banner",
        })(isCurrentUser)}
      />

      <Flex tw="container z-20 relative" justifyBetween>
        <Flex tw="gap-2">
          <Box
            className="group"
            tw="relative rounded-full overflow-hidden transform -translate-y-1/3"
          >
            <Button
              raw
              tw="flex items-center justify-center w-full h-full absolute top-0 left-0 opacity-0 pointer-events-none
              transition-opacity z-10 background-color[rgba(0,0,0,0.7)] group-hover:(opacity-70 pointer-events-auto)"
              onClick={() => uploadAvatarRef.current?.click()}
            >
              <Text size="13" color="white" weight="medium">
                Edit avatar
              </Text>
            </Button>

            <Avatar tw="" size="xl" border="md" avatarUrl={user.avatarUrl} />
          </Box>

          <Flex column tw="mt-1.5">
            <User
              user={user}
              noAvatar
              size="lg"
              textProps={{ weight: "bolder", color: "black" }}
            />
            <CopyButton
              textToCopy={user.id}
              tw="text-gray-500 hover:text-gray-700"
              copiedComponent={
                <Text color="gray500" weight="bold" tw="mt-0.5" size="13">
                  Copied!
                </Text>
              }
            >
              <Text
                color="gray500"
                weight="bold"
                tw="mt-0.5 hover:text-gray-700"
                size="13"
              >
                {shortenAddress(user?.id || "")}
              </Text>
            </CopyButton>
          </Flex>
        </Flex>

        {isCurrentUser ? (
          <Flex tw="items-end justify-end h-full w-full mt-1.5">
            <Flex tw="gap-1">
              <Button
                theme="gray"
                onClick={() => setActiveModal(Modal.editProfile)}
              >
                Edit profile
              </Button>
            </Flex>
          </Flex>
        ) : null}

        {/* {!isCurrentUser ? (
          <Flex tw="text-white items-end justify-end h-full w-full mt-1.5">
            <Flex tw="gap-1">
              <Button theme="gray">Message</Button>
              <Button theme="gradientOrange" tw="w-10">
                <Text weight="bolder">Hire</Text>
              </Button>
            </Flex>
          </Flex>
        ) : null} */}
      </Flex>
    </>
  );
};

import React, { useRef } from "react";

import type { UserSafe } from "@neftie/common";
import { CopyButton } from "components/buttons/CopyButton";
import { Avatar } from "components/media/Avatar";
import { Banner } from "components/media/Banner";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { queryClient } from "lib/http/queryClient";
import { handleProfileAssetUpload } from "lib/user";
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
  const uploadBannerRef = useRef<HTMLInputElement>(null);

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

      <Banner
        imageUrl={user.bannerUrl}
        tw="mt-2 p-3 h-30"
        edit={onlyTrue({
          onClick: () => uploadBannerRef.current?.click(),
          buttonText: "Add banner",
        })(isCurrentUser)}
      />

      <Flex tw="container z-20 relative" justifyBetween>
        <Flex tw="gap-2 container">
          <Avatar
            tw="transform -translate-y-1/3"
            size="xl"
            border="md"
            avatarUrl={user.avatarUrl}
          />
          <Flex column tw="mt-1.5">
            <Text weight="bolder" size="lg">
              {user.username}
            </Text>
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
        {!isCurrentUser ? (
          <Flex tw="text-white items-end justify-end h-full w-full mt-1.5">
            <Flex tw="gap-1">
              <Button theme="gray">Message</Button>
              <Button theme="gradientOrange" tw="w-10">
                <Text weight="bolder">Hire</Text>
              </Button>
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </>
  );
};

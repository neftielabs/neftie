import React from "react";

import { IoFileTray, IoNotifications } from "react-icons/io5";
import tw from "twin.macro";

import { NeftieIcon } from "components/assets/NeftieIcon";
import { UserHeader } from "components/headers/UserHeader";
import { SearchBar } from "components/search/SearchBar";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { useAuth } from "hooks/useAuth";
import { routes } from "lib/manifests/routes";
import { styled } from "stitches.config";

const HeaderContainer = styled(Box, {
  ...tw`hidden md:flex top-0 left-0 w-full h-7 bg-white border-b border-gray-100`,
  zIndex: 10,
});

interface DesktopHeaderProps {}

export const DesktopHeader: React.FC<DesktopHeaderProps> = () => {
  const { isAuthed } = useAuth();

  return (
    <HeaderContainer>
      <Flex tw="container h-full" justifyBetween itemsCenter>
        <Flex itemsCenter tw="gap-7">
          <Link href={routes.home}>
            <NeftieIcon />
          </Link>
          <SearchBar />
        </Flex>
        <Flex itemsCenter tw="gap-1.5">
          {isAuthed ? (
            <>
              <Flex center tw="w-3.5 h-3.5 border border-gray-200 rounded-full">
                <IoNotifications size="18" tw="text-gray-400" />
              </Flex>
              <Flex center tw="w-3.5 h-3.5 border border-gray-200 rounded-full">
                <IoFileTray size="18" tw="text-gray-400" />
              </Flex>
            </>
          ) : null}

          <UserHeader />
        </Flex>
      </Flex>
    </HeaderContainer>
  );
};

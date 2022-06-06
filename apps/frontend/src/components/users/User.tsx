import React, { useEffect, useMemo, useState } from "react";

import { HiBadgeCheck } from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

import type { MergedUser, UserFullSafe, UserSafe } from "@neftie/common";
import { Avatar } from "components/media/Avatar";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import type { UseGetUserOptions } from "hooks/queries/useGetUser";
import { useGetUser } from "hooks/queries/useGetUser";
import { routes } from "lib/manifests/routes";
import { styled } from "stitches.config";
import type { ComponentVariants } from "types/stitches";
import { onlyTrue } from "utils/fp";
import { getDisplayName, usernameOrId } from "utils/misc";

const UserContainer = styled(Flex, {
  ...tw`items-center`,
  variants: {
    size: {
      xs: tw`gap-0.7`,
      sm: tw`gap-0.7`,
      base: tw`gap-1`,
      md: tw`gap-1.3`,
      lg: tw`gap-1.5`,
    },
  },
});

const UsernameContainer = styled(Flex, {
  ...tw`items-center`,
  variants: {
    size: {
      xs: tw`gap-0.3`,
      sm: tw`gap-0.5`,
      base: tw`gap-0.5`,
      md: tw`gap-0.5`,
      lg: tw`gap-0.7`,
    },
  },
});

interface UserProps extends React.ComponentProps<typeof Flex> {
  user: UserSafe | UserFullSafe | UseGetUserOptions | MergedUser | undefined;
  textProps?: ComponentVariants<typeof Text>;
  size?: ComponentVariants<typeof UserContainer>["size"];
  noAvatar?: boolean;
  noBadge?: boolean;
}

export const User: React.FC<UserProps> = ({
  user: providedUser,
  textProps,
  size = "base",
  noAvatar = false,
  noBadge = false,
  ...props
}) => {
  const [user, setUser] = useState<MergedUser>();

  const shouldFetchUser = providedUser && "from" in providedUser;

  const { data: queriedUser } = useGetUser({
    from: shouldFetchUser ? providedUser.from : { noop: true },
  });

  useEffect(() => {
    if (!shouldFetchUser && providedUser && "user" in providedUser) {
      setUser(providedUser);
    } else if (!shouldFetchUser && providedUser) {
      setUser({ id: providedUser.id, user: providedUser });
    } else if (shouldFetchUser && queriedUser) {
      setUser({ id: queriedUser.id, user: queriedUser });
    }
  }, [providedUser, queriedUser, shouldFetchUser]);

  const sizes = useMemo<{
    t: ComponentVariants<typeof Text>["size"];
    i: number;
    a: React.ComponentProps<typeof Avatar>["size"];
  }>(() => {
    switch (size) {
      case "xs":
        return { a: "xxs", t: 13, i: 13 };
      case "sm":
        return { a: "xs", t: 14, i: 14 };
      case "base":
        return { a: "sm", t: 15, i: 15 };
      case "md":
        return { a: "md", t: "md", i: 17 };
      case "lg":
        return { a: "xl", t: "lg", i: 20 };
      default:
        return { a: "xxs", t: 13, i: 13 };
    }
  }, [size]);

  return (
    <>
      {user ? (
        <Link variant="dimToLight" href={routes.user(usernameOrId(user)).index}>
          <UserContainer size={size} {...props}>
            {onlyTrue(
              <Avatar avatarUrl={user.user?.avatarUrl} size={sizes.a} />
            )(!noAvatar)}

            <UsernameContainer size={size}>
              <Text
                size={sizes.t}
                weight={textProps?.weight || "medium"}
                {...textProps}
              >
                {getDisplayName(user)}
              </Text>

              {onlyTrue(
                <HiBadgeCheck size={sizes.i} tw="mt-0.2 color[#0093ff]" />
              )(!noBadge && !!user.user?.verified)}
            </UsernameContainer>
          </UserContainer>
        </Link>
      ) : (
        <Skeleton tw="w-8 h-1.5" />
      )}
    </>
  );
};

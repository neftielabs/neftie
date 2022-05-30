import React from "react";

import { useRouter } from "next/router";

import { areAddressesEqual } from "@neftie/common";
import { ProfileHeader } from "components/headers/ProfileHeader";
import { Page } from "components/Page";
import { ProfileTabs } from "components/tabs/ProfileTabs";
import { Loader } from "components/ui/Loader";
import { useGetUser } from "hooks/queries/useGetUser";
import { useAuth } from "hooks/useAuth";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

const AccountPage: PageComponent<never> = () => {
  const { replace } = useRouter();

  const { connectedAddress } = useAuth();
  const { data: user, isError } = useGetUser({
    from: { queryParam: "username" },
    keepPreviousData: true,
  });

  if (isError) {
    replace(routes.notFound);
  }

  return (
    <Page title={user?.username}>
      {user ? (
        <>
          <ProfileHeader
            user={user}
            isCurrentUser={areAddressesEqual(user?.id, connectedAddress)}
          />
          <ProfileTabs user={user} />
        </>
      ) : (
        <Loader centered tw="py-10" />
      )}
    </Page>
  );
};

export default AccountPage;

import { ProfileHeader } from "components/headers/ProfileHeader";
import { Page } from "components/Page";
import { ProfileTabs } from "components/tabs/ProfileTabs";
import { useAuth } from "hooks/useAuth";
import { serverClient } from "lib/http/serverClient";
import { handleStaticProps } from "lib/server/handleStaticProps";
import { GetStaticPaths } from "next";
import React from "react";
import { PageComponent } from "types/tsx";

export const getStaticProps = handleStaticProps(async (ctx) => {
  const username = ctx.params?.username;

  if (!username || typeof username !== "string") {
    return {
      notFound: true,
    };
  }

  try {
    const { user } = await serverClient().query.getUser(username);

    return {
      props: {
        user,
      },
      revalidate: 60 * 15, // refresh every 15 minutes
    };
  } catch {}

  return { notFound: true };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const AccountPage: PageComponent<typeof getStaticProps> = ({ serverProps }) => {
  const [, , { connectedAddress }] = useAuth();

  const user = serverProps.user;
  const isCurrentUser = user.address === connectedAddress;

  return (
    <Page title={`@${user.username}` || user.address}>
      <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
      <ProfileTabs user={user} />
    </Page>
  );
};

export default AccountPage;

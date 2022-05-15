import { WalletProvider } from "components/buttons/WalletProvider";
import { CardLayout } from "components/layout/CardLayout";
import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Text } from "components/ui/Text";
import { useAuth } from "hooks/useAuth";
import { useGetIntendedPath } from "hooks/useGetIntendedPath";
import { routes } from "lib/manifests/routes";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";
import { PageComponent } from "types/tsx";
import { Connector, useConnect } from "wagmi";

const ConnectPage: PageComponent<{}> = () => {
  const { push } = useRouter();

  const [{ data: connectData }, connect] = useConnect();

  const intendedPath = useGetIntendedPath();
  const { setActiveModal } = useModalStore();
  const [isAuthed] = useAuth();

  const onConnect = async (c: Connector) => {
    await connect(c);
    setActiveModal(Modal.auth);
  };

  useEffect(() => {
    if (isAuthed) {
      const redirectPath = intendedPath || routes.home;
      push(redirectPath);
    }
  }, [intendedPath, isAuthed, push]);

  return (
    <Box tw="w-full px-10">
      <Text size="3xl" weight="bold" align="center">
        Connect your wallet
      </Text>
      <Text color="gray500" align="center" tw="mt-1.5">
        You can use any of the providers listed below to connect your wallet and
        sign in to your neftie account.
      </Text>
      <Box tw="mt-3">
        {connectData.connectors.map((c) => (
          <WalletProvider
            type="horizontal"
            key={c.id}
            connector={c}
            onConnect={() => onConnect(c)}
          />
        ))}
      </Box>
    </Box>
  );
};

ConnectPage.getLayout = (page) => {
  return (
    <Page title="Connect your wallet">
      <CardLayout>{page}</CardLayout>
    </Page>
  );
};

export default ConnectPage;

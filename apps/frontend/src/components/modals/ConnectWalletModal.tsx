import React from "react";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { FiExternalLink } from "react-icons/fi";
import { WalletProvider } from "components/buttons/WalletProvider";
import { useConnect } from "wagmi";

interface ConnectWalletModalProps {}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = () => {
  const [{ data: connectData }, connect] = useConnect();

  return (
    <Flex tw="pt-4 pb-3 px-3" column>
      <Text weight="bolder" size="2xl">
        Connect your wallet
      </Text>
      <Text color="gray600" tw="mt-1 w-4/5">
        You can use any of the providers listed below to connect your wallet and
        sign in to your neftie account.
      </Text>
      <Link
        href="https://www.coinbase.com/learn/crypto-basics/what-is-a-crypto-wallet"
        tw="mt-0.5 underline flex items-center gap-0.7 text-gray-500"
        variant="dimToBlack"
        target="_blank"
        title="Coinbase — What is a crypto wallet?"
      >
        What is a wallet?
        <FiExternalLink size="13" tw="mt-0.2" />
      </Link>
      <Box tw="mt-3">
        {connectData.connectors.map((c) => (
          <WalletProvider
            key={c.id}
            connector={c}
            onConnect={() => connect(c)}
          />
        ))}
      </Box>
    </Flex>
  );
};

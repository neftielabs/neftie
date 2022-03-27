import { MetaMaskLogo } from "components/assets/MetaMaskLogo";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import React, { useMemo } from "react";
import { Connector } from "wagmi";

interface WalletProviderProps {
  connector: Connector<any, any>;
  onConnect: () => void;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  connector,
  onConnect,
}) => {
  const item = useMemo(() => {
    if (connector.name === "MetaMask") {
      return {
        connector,
        icon: <MetaMaskLogo />,
      };
    }

    return null;
  }, [connector]);

  return (
    <>
      {item ? (
        <Button raw onClick={onConnect}>
          <Flex
            column
            itemsCenter
            tw="gap-1 border border-gray-150 p-3 rounded-12 overflow-hidden hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <Box>{React.cloneElement(item.icon, { width: 30 })}</Box>
            <Text weight="bold" color="gray700">
              {item.connector.name}
            </Text>
          </Flex>
        </Button>
      ) : null}
    </>
  );
};

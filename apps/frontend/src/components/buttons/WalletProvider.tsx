import React, { useMemo } from "react";

import { MetaMaskLogo } from "components/assets/MetaMaskLogo";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Text } from "components/ui/Text";
import { styled } from "stitches.config";
import tw from "twin.macro";
import { ComponentVariants } from "types/stitches";
import { Connector } from "wagmi";

const ProviderContainer = styled(Button, {
  ...tw`flex items-center hover:shadow-lg transform hover:-translate-y-0.5 transition-all
  border overflow-hidden rounded-12`,
  variants: {
    type: {
      square: tw`flex-col gap-1
      border border-gray-150 p-3`,
      horizontal: tw`w-full border-gray-150 px-3 py-2`,
    },
  },
  defaultVariants: {
    type: "square",
  },
});

interface WalletProviderProps
  extends ComponentVariants<typeof ProviderContainer> {
  connector: Connector<any, any>;
  onConnect: () => void;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  connector,
  onConnect,
  type,
  ...props
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

  if (!item) {
    return null;
  }

  return (
    <ProviderContainer type={type} {...props} raw onClick={onConnect}>
      <Box css={type === "horizontal" ? tw`flex[0 1 0%]` : {}}>
        {React.cloneElement(item.icon, { width: 30 })}
      </Box>

      {type === "horizontal" ? (
        <Text tw="flex[1 1 0%]" weight="bold" size="md" color="gray700">
          {item.connector.name}
        </Text>
      ) : (
        <Text weight="bold" color="gray700">
          {item.connector.name}
        </Text>
      )}

      {type === "horizontal" ? <Box tw="flex[0 1 0%] px-1"></Box> : null}
    </ProviderContainer>
  );
};

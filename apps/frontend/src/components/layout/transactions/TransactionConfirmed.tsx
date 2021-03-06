import React from "react";

import { TransactionBody } from "components/layout/transactions/TransactionBody";
import { Box } from "components/ui/Box";
import { ExternalLink } from "components/ui/ExternalLink";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { getEtherscanLink } from "utils/web3";

interface TransactionConfirmedProps {
  title: string;
  subtitle: string;
  txHash?: string;
}

export const TransactionConfirmed: React.FC<TransactionConfirmedProps> = ({
  title,
  subtitle,
  txHash,
  children,
}) => {
  return (
    <TransactionBody>
      <Flex column itemsCenter tw="gap-3">
        <Box>
          <Text size="3xl" weight="bold" align="center" tw="mb-1.5">
            {title}
          </Text>
          <Text color="gray500" align="center">
            {subtitle}
          </Text>
        </Box>

        {children ? (
          <Flex tw="my-2 w-full" center>
            {children}
          </Flex>
        ) : null}

        {txHash ? (
          <ExternalLink
            href={getEtherscanLink({ tx: txHash })}
            variant="dimToBlack"
            tw="text-13 "
          >
            View on Etherscan
          </ExternalLink>
        ) : null}
      </Flex>
    </TransactionBody>
  );
};

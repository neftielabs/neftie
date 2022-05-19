import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { useWallet } from "hooks/useWallet";
import { useModalStore } from "stores/useModalStore";

interface SignMessageModalProps {}

export const SignMessageModal: React.FC<SignMessageModalProps> = () => {
  const [isLoading, requestSignature] = useWallet();
  const [error, setError] = useState("");
  const { closeModal } = useModalStore();

  const signMessage = async () => {
    const result = await requestSignature();

    if (result?.error) {
      setError(error);
    } else {
      closeModal();
    }
  };

  return (
    <Flex tw="pt-4 pb-3 px-3" column itemsCenter>
      <Text weight="bolder" size="2xl" tw="mb-0.5" align="center">
        Sign the message
      </Text>
      <Text color="gray600" tw="mt-1 w-4/5" align="center">
        In order to continue, we need you to sign a message with your wallet to
        prove you have control of this specific address.
      </Text>
      <Button
        size="lg"
        tw="mt-3 mx-auto w-2/3"
        isLoading={isLoading}
        onClick={() => signMessage()}
      >
        Sign message
      </Button>
    </Flex>
  );
};

import React, { useState } from "react";

import { Button, ButtonProps } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { FiCopy } from "react-icons/fi";
import { ifTrue } from "utils/fp";

interface CopyButtonProps extends ButtonProps {
  textToCopy: string;
  copiedComponent?: JSX.Element;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  copiedComponent,
  children,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      document.execCommand("copy", true, textToCopy);
    }
  };

  const handleCopy = () => {
    copyText()
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch();
  };

  return (
    <Button
      theme="none"
      tw="self-start"
      animated={false}
      onClick={handleCopy}
      disabled={copied}
      {...props}
    >
      <Flex itemsCenter justifyBetween tw="w-full gap-1">
        {ifTrue(copiedComponent || <Text>Copied!</Text>, children)(copied)}
        <FiCopy size="13" tw="-mb-0.3" />
      </Flex>
    </Button>
  );
};

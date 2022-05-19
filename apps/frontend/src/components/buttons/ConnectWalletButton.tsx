import React from "react";

import { Button } from "components/ui/Button";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";

interface ConnectWalletButtonProps {}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = () => {
  const { setActiveModal } = useModalStore();

  return (
    <Button size="sm" text="13" onClick={() => setActiveModal(Modal.auth)}>
      Connect wallet
    </Button>
  );
};

import { Button } from "components/ui/Button";

import React from "react";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";

interface ConnectWalletButtonProps {}

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = () => {
  const { setActiveModal } = useModalStore();

  return (
    <Button onClick={() => setActiveModal(Modal.auth)}>Connect wallet</Button>
  );
};

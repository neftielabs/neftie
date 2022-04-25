import { ConnectWalletModal } from "components/modals/ConnectWalletModal";
import { ModalController } from "components/modals/ModalController";
import { SignMessageModal } from "components/modals/SignMessageModal";
import React from "react";
import { Modal } from "types/modals";
import { useConnect } from "wagmi";

interface AuthModalProps {}

export const AuthModal: React.FC<AuthModalProps> = () => {
  const [{ data: connectData }] = useConnect();

  return (
    <ModalController type={Modal.auth} tw="max-width[550px]">
      {!connectData.connected ? <ConnectWalletModal /> : <SignMessageModal />}
    </ModalController>
  );
};

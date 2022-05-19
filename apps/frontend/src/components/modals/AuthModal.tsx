import React, { useEffect } from "react";

import { ConnectWalletModal } from "components/modals/ConnectWalletModal";
import { ModalController } from "components/modals/ModalController";
import { SignMessageModal } from "components/modals/SignMessageModal";
import { useAuth } from "hooks/useAuth";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";
import { useConnect } from "wagmi";

interface AuthModalProps {}

export const AuthModal: React.FC<AuthModalProps> = () => {
  const [{ data: connectData }] = useConnect();
  const { closeModal } = useModalStore();
  const [isAuthed] = useAuth();

  useEffect(() => {
    if (isAuthed) {
      closeModal();
    }
  }, [closeModal, isAuthed]);

  return (
    <ModalController type={Modal.auth} tw="max-width[550px]">
      {!isAuthed && !connectData.connected ? (
        <ConnectWalletModal />
      ) : (
        <SignMessageModal />
      )}
    </ModalController>
  );
};

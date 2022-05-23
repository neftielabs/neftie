import React, { useEffect } from "react";

import { useConnect } from "wagmi";

import { ConnectWalletModal } from "components/modals/ConnectWalletModal";
import { ModalController } from "components/modals/ModalController";
import { SignMessageModal } from "components/modals/SignMessageModal";
import { useAuth } from "hooks/useAuth";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";

interface AuthModalProps {}

export const AuthModal: React.FC<AuthModalProps> = () => {
  const { isConnected } = useConnect();
  const { closeModal } = useModalStore();
  const { isAuthed } = useAuth();

  useEffect(() => {
    if (isAuthed) {
      closeModal();
    }
  }, [closeModal, isAuthed]);

  return (
    <ModalController type={Modal.auth} tw="max-width[550px]">
      {!isAuthed && !isConnected ? (
        <ConnectWalletModal />
      ) : (
        <SignMessageModal />
      )}
    </ModalController>
  );
};

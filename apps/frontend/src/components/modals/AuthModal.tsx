import { ConnectWalletModal } from "components/modals/ConnectWalletModal";
import { SignMessageModal } from "components/modals/SignMessageModal";
import React from "react";
import { useConnect } from "wagmi";

interface AuthModalProps {}

export const AuthModal: React.FC<AuthModalProps> = () => {
  const [{ data: connectData }] = useConnect();

  return (
    <>
      {!connectData.connected ? <ConnectWalletModal /> : <SignMessageModal />}
    </>
  );
};

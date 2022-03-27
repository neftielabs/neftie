import { AuthModal } from "components/modals/AuthModal";
import React from "react";

interface ModalProviderProps {}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <AuthModal />
    </>
  );
};

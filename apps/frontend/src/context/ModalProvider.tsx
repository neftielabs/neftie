import React from "react";

import { AuthModal } from "components/modals/AuthModal";

interface ModalProviderProps {}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <AuthModal />
    </>
  );
};

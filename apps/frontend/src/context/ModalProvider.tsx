import React from "react";

import { AuthModal } from "components/modals/AuthModal";

interface ModalProviderProps {
  modals: React.FC[];
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  modals,
  children,
}) => {
  return (
    <>
      {children}
      <AuthModal />
      {modals.map((M, i) => (
        <M key={i} />
      ))}
    </>
  );
};

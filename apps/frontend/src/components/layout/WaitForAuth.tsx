import React from "react";

import { Box } from "components/ui/Box";
import { Loader } from "components/ui/Loader";

interface WaitForAuthProps {
  isAuthed: boolean;
  isAuthLoading: boolean;
  redirectToConnect: () => void;
  requiresAuth: boolean;
}

export const WaitForAuth: React.FC<WaitForAuthProps> = ({
  isAuthed,
  isAuthLoading,
  redirectToConnect,
  requiresAuth,
  children,
}) => {
  if (requiresAuth && !isAuthed) {
    if (!isAuthLoading) {
      redirectToConnect();
    }

    return (
      <Box tw="w-full h-full py-10">
        <Loader absoluteCentered />
      </Box>
    );
  }

  return <>{children}</>;
};

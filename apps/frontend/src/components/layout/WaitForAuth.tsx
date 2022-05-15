import { Box } from "components/ui/Box";
import { Loader } from "components/ui/Loader";
import React from "react";

interface WaitForAuthProps {
  isAuthed: boolean;
}

export const WaitForAuth: React.FC<WaitForAuthProps> = ({
  isAuthed,
  children,
}) => {
  if (!isAuthed) {
    return (
      <Box tw="w-full h-full py-10">
        <Loader absoluteCentered />
      </Box>
    );
  }

  return <>{children}</>;
};

import React from "react";

import { DesktopHeader } from "components/headers/DesktopHeader";
import { MobileHeader } from "components/headers/MobileHeader";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
};

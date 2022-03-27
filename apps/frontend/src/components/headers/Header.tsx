import { DesktopHeader } from "components/headers/DesktopHeader";
import { MobileHeader } from "components/headers/MobileHeader";
import React from "react";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
};

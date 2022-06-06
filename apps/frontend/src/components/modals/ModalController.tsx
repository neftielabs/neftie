import React, { useEffect, useState } from "react";

import { useIsMounted } from "@react-hookz/web";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

import { ModalBox } from "components/modals/ModalBox";
import { ModalContainer } from "components/modals/ModalContainer";
import { Backdrop } from "components/ui/Backdrop";
import { Button } from "components/ui/Button";
import type { Flex } from "components/ui/Flex";
import { RoundedIcon } from "components/ui/RoundedIcon";
import { useModalStore } from "stores/useModalStore";
import type { Modal } from "types/modals";
import { isServer } from "utils/app";
import { setPageScrollable } from "utils/misc";

interface ModalControllerProps extends React.ComponentProps<typeof Flex> {
  type: Modal;
  onClose?: () => void;
  preventClose?: boolean;
  raw?: boolean;
}

export const ModalController: React.FC<ModalControllerProps> = ({
  type,
  onClose,
  preventClose,
  children,
  raw = false,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMounted = useIsMounted();
  const [activeModal, closeModal] = useModalStore((s) => [
    s.activeModal,
    s.closeModal,
  ]);

  useEffect(() => {
    setIsVisible(activeModal === type);
  }, [activeModal, type]);

  useEffect(() => {
    setPageScrollable(!isVisible);
  }, [isVisible]);

  const onModalClose = () => {
    if (onClose) onClose();
    closeModal();
  };

  return (
    <>
      {isMounted() && !isServer
        ? createPortal(
            <ModalContainer justifyCenter itemsCenter visible={isVisible}>
              {raw ? (
                children
              ) : (
                <ModalBox visible={isVisible} {...props}>
                  <Button
                    raw
                    tw="absolute right-2 top-2"
                    onClick={() => onModalClose()}
                  >
                    <RoundedIcon>
                      <FiX size="25" />
                    </RoundedIcon>
                  </Button>

                  {children}
                </ModalBox>
              )}

              <Backdrop visible={true} onClick={() => onModalClose()} />
            </ModalContainer>,
            document.querySelector("#__next")!
          )
        : null}
    </>
  );
};

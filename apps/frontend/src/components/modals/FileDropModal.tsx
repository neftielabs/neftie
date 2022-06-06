import React from "react";

import { FileDrop } from "components/forms/file-drop/FileDrop";
import { ModalController } from "components/modals/ModalController";
import { Box } from "components/ui/Box";
import { Modal } from "types/modals";

interface FileDropModalProps extends React.ComponentProps<typeof FileDrop> {}

export const FileDropModal: React.FC<FileDropModalProps> = (props) => {
  return (
    <ModalController type={Modal.fileDrop} tw="max-width[500px]">
      <Box tw="px-3 pt-5 pb-3">
        <FileDrop {...props} />
      </Box>
    </ModalController>
  );
};

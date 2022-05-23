import React from "react";

import { FiTrash } from "react-icons/fi";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Image } from "components/ui/Image";
import { RoundedIcon } from "components/ui/RoundedIcon";

interface FileDropPreviewProps {
  preview: string;
  onRemove: () => void;
}

export const FileDropPreview: React.FC<FileDropPreviewProps> = ({
  preview,
  onRemove,
}) => {
  return (
    <Box tw="w-full rounded-12 border border-gray-150 mt-2 relative">
      <Box tw="h-20 rounded-12 overflow-hidden">
        <Image src={preview} alt="" />
      </Box>
      <Button raw type="button" tw="absolute right-1 top-1" onClick={onRemove}>
        <RoundedIcon tw="bg-white">
          <FiTrash />
        </RoundedIcon>
      </Button>
    </Box>
  );
};

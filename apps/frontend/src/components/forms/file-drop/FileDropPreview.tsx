import React from "react";

import { FiTrash } from "react-icons/fi";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Image } from "components/ui/Image";
import { RoundedIcon } from "components/ui/RoundedIcon";

interface FileDropPreviewProps extends React.ComponentProps<typeof Box> {
  preview: string;
  onRemove: () => void;
  imageProps?: React.ComponentProps<typeof Box>;
}

export const FileDropPreview: React.FC<FileDropPreviewProps> = ({
  preview,
  onRemove,
  imageProps,
  ...props
}) => {
  return (
    <Box tw="w-full rounded-12 border border-gray-150 mt-2 relative" {...props}>
      <Box tw="h-20 rounded-12 overflow-hidden" {...imageProps}>
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

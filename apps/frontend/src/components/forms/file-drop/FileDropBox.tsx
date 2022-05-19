import React from "react";

import { Box } from "components/ui/Box";
import { Text } from "components/ui/Text";
import { DropzoneState } from "react-dropzone";
import { styled } from "stitches.config";
import tw from "twin.macro";

const DropContainer = styled(Box, {
  ...tw`flex flex-1 flex-col items-center rounded-12
  border border-gray-150 bg-gray-25 text-gray-600 outline-none
  transition-border overflow-hidden text-center border-dashed`,
  variants: {
    focused: {
      true: tw`border-gray-900`,
      false: {},
    },
    accepted: {
      true: tw`border-success`,
      false: {},
    },
    rejected: {
      true: tw`border-error`,
      false: {},
    },
  },
  defaultVariants: {
    focused: false,
    accepted: false,
    rejected: false,
  },
});

interface FileDropBoxProps
  extends Pick<
    DropzoneState,
    | "isFocused"
    | "isDragAccept"
    | "isDragReject"
    | "getInputProps"
    | "getRootProps"
  > {
  name: string;
}

export const FileDropBox: React.FC<FileDropBoxProps> = ({
  isFocused,
  isDragAccept,
  isDragReject,
  getInputProps,
  getRootProps,
  name,
}) => {
  return (
    <>
      <DropContainer
        focused={isFocused}
        accepted={isDragAccept}
        rejected={isDragReject}
      >
        <Box
          {...getRootProps({
            style: tw`w-full h-full px-2 py-5 bg-transparent`,
          })}
        >
          <input {...getInputProps()} name={name} />

          <Text>Drag n drop some files here, or click to select files</Text>
        </Box>
      </DropContainer>
    </>
  );
};

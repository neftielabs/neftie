import React, { useCallback, useEffect, useState } from "react";

import { useField } from "formik";
import { useDropzone } from "react-dropzone";

import { FileDropBox } from "components/forms/file-drop/FileDropBox";
import { FileDropPreview } from "components/forms/file-drop/FileDropPreview";
import { Label } from "components/forms/Label";
import { Box } from "components/ui/Box";
import { Text } from "components/ui/Text";

interface FileDropProps {
  label?: string;
  help?: string;
  name: string;
  fileFieldName: string;
}

export const FileDrop: React.FC<FileDropProps> = ({
  label,
  help,
  name,
  fileFieldName,
}) => {
  const [, , uriHelpers] = useField(name);
  const [, , fileHelpers] = useField(fileFieldName);

  const [file, setFile] = useState<File & { preview: string }>();
  const [error, setError] = useState("");

  /**
   * File drop handler
   */
  const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
    setError("");
    setFile(undefined);

    const acceptedFile = acceptedFiles[0] || undefined;

    if (acceptedFile) {
      setFile(
        Object.assign(acceptedFile, {
          preview: URL.createObjectURL(acceptedFile),
        })
      );
    }
  }, []);

  const { fileRejections, ...dropzoneState } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    multiple: false,
    maxSize: 10 * 1000000, // 10mb in bytes
    onDrop,
  });

  useEffect(() => {
    // Revoke data URIs on unmount to avoid memory leaks
    return () => (file ? URL.revokeObjectURL(file.preview) : undefined);
  }, [file]);

  useEffect(() => {
    if (fileRejections.length && fileRejections[0].errors.length) {
      let currentError = fileRejections[0].errors[0].message;
      const match = currentError.match(/(?<=than )(\d+)(?= bytes)/g);

      // Convert bytes to mb

      if (match?.length && parseInt(match[0])) {
        currentError = currentError
          .replace(match[0], String(parseInt(match[0]) / 1000000))
          .replace("bytes", "MB");
      }

      setError(currentError);
    } else if (!fileRejections.length || !!file) {
      setError("");
    }
  }, [file, fileRejections]);

  useEffect(() => {
    uriHelpers.setValue(file?.preview);
    fileHelpers.setValue(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.preview]);

  return (
    <Box>
      {label ? (
        <Box tw="mb-1 ml-0.5">
          <Label>{label}</Label>
          {help ? (
            <Text size="13" tw="mt-0.3" color="gray500">
              {help}
            </Text>
          ) : null}
        </Box>
      ) : null}

      {!file ? (
        <FileDropBox name={name} {...dropzoneState} />
      ) : (
        <FileDropPreview
          preview={file.preview}
          onRemove={() => setFile(undefined)}
        />
      )}

      {error ? (
        <Box tw="mt-1">
          <Text color="error" size="13">
            {error}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
};

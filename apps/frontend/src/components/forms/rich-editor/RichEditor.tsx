import React, { useEffect, useMemo, useRef, useState } from "react";

import type { ContentBlock, DraftHandleValue } from "draft-js";
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { useField } from "formik";
import { theme } from "twin.macro";

import { Label } from "components/forms/Label";
import { EditorControls } from "components/forms/rich-editor/EditorControls";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";

interface RichEditorProps
  extends Omit<
    React.ComponentProps<typeof Editor>,
    "onChange" | "editorState"
  > {
  label?: string;
  labelProps?: React.ComponentProps<typeof Label>;
  required?: boolean;
  name?: string;
  textName?: string;
  content?: Record<string, unknown>;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  label,
  labelProps,
  required,
  name,
  textName,
  content,
  ...editorProps
}) => {
  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    content
      ? EditorState.createWithContent(convertFromRaw(content as any))
      : EditorState.createEmpty()
  );

  const [, , fieldHelpers] = useField(name || "noname");
  const [, , fieldTextHelpers] = useField(textName || "nonametext");

  const currentTextLength = useMemo(
    () => editorState.getCurrentContent().getPlainText().length,
    [editorState]
  );

  useEffect(() => {
    const editorContent = editorState.getCurrentContent();
    const rawContent = convertToRaw(editorContent);

    fieldHelpers.setValue(currentTextLength <= 0 ? undefined : rawContent);
    fieldTextHelpers.setValue(editorContent.getPlainText());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState, currentTextLength]);

  const setInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const setBlockType = (type: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  };

  const blockStyleFn = (block: ContentBlock) => {
    if (block.getType() === "blockquote") {
      return "richeditor-blockquote";
    }

    return "";
  };

  const handleKeyCommand = (
    command: string,
    state: EditorState
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  return (
    <Box>
      {label ? (
        <Box tw="mb-1 ml-0.5">
          <Label {...labelProps}>
            {label}{" "}
            {required ? (
              <Text as="span" color="error">
                *
              </Text>
            ) : null}
          </Label>
        </Box>
      ) : null}
      <Flex
        column
        tw="rounded-12 border border-gray-150 min-height[200px] overflow-hidden"
        onClick={() => ref.current?.focus()}
      >
        <EditorControls
          editorState={editorState}
          onStyleToggle={(style) => setInlineStyle(style)}
          onBlockToggle={(type) => setBlockType(type)}
        />

        <style>
          {`
          .richeditor-blockquote {
            border-left: 5px solid ${theme("colors.gray.150")};
            padding-left: 15px;
            color: ${theme("colors.gray.500")}
          }
        `}
        </style>

        <Box
          tw="px-1.5 pt-1.5 pb-4 h-full relative flex-grow word-break[break-word] cursor-text"
          onClick={() => ref.current?.focus()}
        >
          <Editor
            ref={ref}
            editorState={editorState}
            onChange={setEditorState}
            blockStyleFn={blockStyleFn}
            handleKeyCommand={handleKeyCommand}
            {...editorProps}
          />

          <Text
            tw="absolute bottom-1 right-1.5"
            size="13"
            color="gray500"
            css={{
              color:
                1000 - currentTextLength < 0 ? "red" : theme("colors.gray.500"),
            }}
          >
            {1000 - currentTextLength}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

import React, { useEffect, useMemo, useState } from "react";

import type { ContentBlock } from "draft-js";
import { Editor, EditorState, convertFromRaw } from "draft-js";
import { theme } from "twin.macro";

import { noop } from "utils/fp";

interface EditorRendererProps
  extends Omit<
    React.ComponentProps<typeof Editor>,
    "onChange" | "editorState"
  > {
  rawContent?: string | null;
  fallback?: JSX.Element;
}

export const EditorRenderer: React.FC<EditorRendererProps> = ({
  rawContent,
  fallback,
  ...editorProps
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const rawTextLength = useMemo(
    () => editorState.getCurrentContent().getPlainText().length,
    [editorState]
  );

  const blockStyleFn = (block: ContentBlock) => {
    if (block.getType() === "blockquote") {
      return "richeditor-blockquote";
    }

    return "";
  };

  useEffect(() => {
    if (rawContent) {
      try {
        const parsedContent = convertFromRaw(JSON.parse(rawContent));
        setEditorState(EditorState.createWithContent(parsedContent));
      } catch {}
    }
  }, [rawContent]);

  return (
    <>
      <style>
        {`
          .DraftEditor-root span {
            line-height: 1.7
          }

          .richeditor-blockquote {
            border-left: 5px solid ${theme("colors.gray.150")};
            padding-left: 15px;
            color: ${theme("colors.gray.500")}
          }
        `}
      </style>

      {rawTextLength > 0 ? (
        <Editor
          readOnly
          onChange={noop}
          editorState={editorState}
          blockStyleFn={blockStyleFn}
          {...editorProps}
        />
      ) : (
        fallback ?? null
      )}
    </>
  );
};

import React from "react";

import type { EditorState } from "draft-js";
import { BiListOl, BiListUl } from "react-icons/bi";
import tw from "twin.macro";

import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { styled } from "stitches.config";
import type { ComponentVariants } from "types/stitches";

const ControlElement = styled(Button, {
  ...tw`h-2.5 rounded-md text-13 font-bold text-gray-500 hover:bg-gray-25
  flex items-center justify-center`,
  variants: {
    active: {
      true: tw`bg-gray-50`,
      false: {},
    },
    shape: {
      square: tw`w-2.5`,
      rectangle: {},
    },
  },
  defaultVariants: {
    active: false,
    shape: "square",
  },
});

interface ControlProps extends ComponentVariants<typeof ControlElement> {
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string | JSX.Element;
}

export const Control: React.FC<ControlProps> = ({
  onToggle,
  label,
  ...props
}) => {
  return (
    <ControlElement raw type="button" onMouseDown={onToggle} {...props}>
      {label}
    </ControlElement>
  );
};

interface EditorControlsProps {
  editorState: EditorState;
  onStyleToggle: (style: string) => void;
  onBlockToggle: (type: string) => void;
}

const inlineStyles = [
  { label: "B", style: "BOLD" },
  { label: "I", style: "ITALIC" },
  { label: "U", style: "UNDERLINE" },
];

const blockTypes = [
  { label: ">", style: "blockquote" },
  { label: <BiListOl size="18" />, style: "ordered-list-item" },
  { label: <BiListUl size="18" />, style: "unordered-list-item" },
];

export const EditorControls: React.FC<EditorControlsProps> = ({
  editorState,
  onStyleToggle,
  onBlockToggle,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  const handleToggle = (
    ev: React.MouseEvent<HTMLButtonElement>,
    cb: () => void
  ) => {
    ev.preventDefault();
    cb();
  };

  return (
    <Flex tw="w-full py-0.7 px-2 border-b border-gray-150 gap-1">
      {inlineStyles.map((type) => (
        <Control
          key={type.style}
          label={type.label}
          active={currentStyle.has(type.style)}
          onToggle={(e) => handleToggle(e, () => onStyleToggle(type.style))}
        />
      ))}

      {blockTypes.map((type) => (
        <Control
          key={type.style}
          label={type.label}
          active={currentStyle.has(type.style)}
          onToggle={(e) => handleToggle(e, () => onBlockToggle(type.style))}
        />
      ))}
    </Flex>
  );
};

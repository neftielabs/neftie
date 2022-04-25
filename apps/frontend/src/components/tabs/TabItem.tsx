import React, { useRef } from "react";
import { styled } from "stitches.config";
import tw from "twin.macro";

const Item = styled("button", {
  ...tw`px-1 py-1 font-bold`,
  variants: {
    active: {
      true: tw`text-gray-900 border-b-0.2 border-gray-900`,
      false: tw`text-gray-500`,
    },
  },
});

interface TabItemProps extends React.ComponentProps<typeof Item> {
  active: boolean;
  setIndicatorParams: (d: { width: number; x: number }) => void;
}

export const TabItem: React.FC<TabItemProps> = ({
  active,
  setIndicatorParams: setIndicatorProps,
  children,
  ...props
}) => {
  const itemRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    const item = itemRef.current;

    if (item) {
      setIndicatorProps({
        width: item.getBoundingClientRect().width,
        x: item.offsetLeft,
      });
    }
  };

  return (
    <Item
      ref={itemRef}
      active={active}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Item>
  );
};

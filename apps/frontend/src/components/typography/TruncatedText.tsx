import React from "react";

import { Text } from "components/ui/Text";

interface TruncatedTextProps extends React.ComponentProps<typeof Text> {
  max: number;
  text: string;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  max,
  text,
  ...props
}) => {
  const shouldTruncate = text.length > max;

  return (
    <Text {...props}>{shouldTruncate ? `${text.slice(0, max)}...` : text}</Text>
  );
};

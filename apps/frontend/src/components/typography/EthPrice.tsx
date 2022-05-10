import { Text } from "components/ui/Text";
import React from "react";

interface EthPriceProps extends React.ComponentProps<typeof Text> {
  price: number | string;
  svgProps?: React.SVGAttributes<SVGSVGElement>;
}

export const EthPrice: React.FC<EthPriceProps> = ({
  price,
  svgProps,
  ...props
}) => {
  return (
    <Text size="lg" weight="bold" {...props}>
      {price} ETH
    </Text>
  );
};

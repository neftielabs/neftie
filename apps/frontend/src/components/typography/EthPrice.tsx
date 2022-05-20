import React from "react";

import { EthIcon } from "components/assets/EthIcon";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";

interface EthPriceProps extends React.ComponentProps<typeof Text> {
  price: number | string;
}

interface EthPriceLabelProps extends EthPriceProps {
  label: true;
}

interface EthPriceIconProps extends EthPriceProps {
  label?: false | undefined;
  svgProps?: React.SVGAttributes<SVGSVGElement>;
  containerProps?: React.ComponentProps<typeof Flex>;
}

export const EthPrice: React.FC<EthPriceLabelProps | EthPriceIconProps> = ({
  price,
  ...props
}) => {
  if (props.label) {
    return (
      <Text size="14" weight="bold" {...props}>
        {price} ETH
      </Text>
    );
  }

  const { containerProps, svgProps, ...textProps } = props;

  return (
    <Flex itemsCenter tw="gap-0.7" {...containerProps}>
      <EthIcon width="8" {...svgProps} />
      <Text size="14" weight="bold" {...textProps}>
        {price}
      </Text>
    </Flex>
  );
};

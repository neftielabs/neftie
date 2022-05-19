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
  return (
    <>
      {props.label ? (
        <Text size="14" weight="bold" {...props}>
          {price} ETH
        </Text>
      ) : (
        <Flex itemsCenter tw="gap-0.7" {...props.containerProps}>
          <EthIcon width="8" {...props.svgProps} />
          <Text size="14" weight="bold" {...props}>
            {price}
          </Text>
        </Flex>
      )}
    </>
  );
};

import React from "react";

import type { IconBaseProps } from "react-icons";
import { FiExternalLink } from "react-icons/fi";

import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";

type ExternalLinkProps = React.ComponentProps<typeof Link> & {
  iconProps?: IconBaseProps;
  containerProps?: React.ComponentProps<typeof Flex>;
};

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  iconProps,
  containerProps,
  children,
  ...props
}) => {
  return (
    <Link target="_blank" {...props}>
      <Flex itemsCenter tw="gap-0.5" {...containerProps}>
        {children}
        <FiExternalLink size="13" tw="mt-0.1" {...iconProps} />
      </Flex>
    </Link>
  );
};

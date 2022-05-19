import React from "react";

import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";

interface FooterColumnProps {
  heading: string;
  url?: string;
  items: string[][];
}

export const FooterColumn: React.FC<FooterColumnProps> = ({
  heading,
  url,
  items,
}) => {
  return (
    <Flex column tw="gap-2">
      {url ? (
        <Link href={url}>
          <Text weight="bolder" size="md">
            {heading}
          </Text>
        </Link>
      ) : (
        <Text weight="bolder" size="md">
          {heading}
        </Text>
      )}

      <Flex column tw="gap-1">
        {items.map((item, i) => (
          <Link key={i} href={item[1]} variant="lightToWhite">
            {item[0]}
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

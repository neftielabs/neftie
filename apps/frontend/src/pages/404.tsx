import React from "react";

import { Page } from "components/Page";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { routes } from "lib/manifests/routes";

const NotFoundPage: React.FC = () => {
  return (
    <Page title="404">
      <Flex itemsCenter column tw="py-10">
        <Text weight="extrabold" css={{ fontSize: 70 }}>
          404
        </Text>
        <Text weight="bold" size="2xl">
          Boring, isn&apos;t it
        </Text>
        <Link href={routes.home}>
          <Button tw="mt-2" theme="gradient" size="lg">
            Take me home
          </Button>
        </Link>
      </Flex>
    </Page>
  );
};

export default NotFoundPage;

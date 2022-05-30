import React, { useState } from "react";

import { useRouter } from "next/router";

import { BaseCard } from "components/cards/BaseCard";
import { OrdersTable } from "components/orders/OrdersTable";
import { Page } from "components/Page";
import { RoleSwitch } from "components/pills/RoleSwitch";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useGetUser } from "hooks/queries/useGetUser";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

interface OrdersPageProps {}

const OrdersPage: PageComponent<OrdersPageProps> = () => {
  const entities = ["Seller", "Client"] as const;
  const [currentEntity, setCurrentEntity] =
    useState<typeof entities[number]>("Seller");
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();

  const { data: user, isError } = useGetUser({ from: { currentUser: true } });

  if (isError) {
    push(routes.home);
  }

  if (!user) {
    return <Loader centered tw="py-30" />;
  }

  return (
    <Page title="Your orders">
      <Box tw="bg-gray-25">
        <Container tw="pt-4 pb-10">
          <Text size="3xl" weight="bold">
            Manage your orders
          </Text>
          <BaseCard tw="mt-3 p-3">
            <Flex column tw="gap-4">
              <Flex tw="w-full" center>
                <RoleSwitch
                  options={entities}
                  onSwitch={(c) => setCurrentEntity(c)}
                  isLoading={isLoading}
                />
              </Flex>
              <OrdersTable
                entity={currentEntity}
                setLoading={(v) => setIsLoading(v)}
              />
            </Flex>
          </BaseCard>
        </Container>
      </Box>
    </Page>
  );
};

OrdersPage.requiresAuth = true;

export default OrdersPage;

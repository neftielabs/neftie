import React from "react";

import { BaseCard } from "components/cards/BaseCard";
import { Avatar } from "components/media/Avatar";
import { Page } from "components/Page";
import { RoleSwitch } from "components/pills/RoleSwitch";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import type { PageComponent } from "types/tsx";

interface OrdersPageProps {}

const OrdersPage: PageComponent<OrdersPageProps> = () => {
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
                  options={["Seller", "Client"] as const}
                  onSwitch={() =>
                    new Promise((r) => {
                      setTimeout(r, 2000);
                    })
                  }
                />
              </Flex>
              <Flex column>
                <table tw="w-full">
                  <thead>
                    <tr>
                      {[
                        "Client",
                        "Listing",
                        "Deadline at",
                        "Total",
                        "Status",
                      ].map((h) => (
                        <th key={h} tw="py-1 border-t border-b border-gray-100">
                          <Text weight="medium" size="13" color="gray500">
                            {h}
                          </Text>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td tw="py-1 flex items-center gap-1">
                        <Avatar size="xs" />
                        <Text size="13" color="gray500">
                          whoever
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Flex
                  tw="border-t border-b border-gray-100 py-1 px-3"
                  justifyBetween
                >
                  {["Client", "Listing", "Deadline at", "Total", "Status"].map(
                    (h) => (
                      <Text key={h} weight="medium" size="13" color="gray500">
                        {h}
                      </Text>
                    )
                  )}
                </Flex>
              </Flex>
            </Flex>
          </BaseCard>
        </Container>
      </Box>
    </Page>
  );
};

OrdersPage.requiresAuth = true;

export default OrdersPage;

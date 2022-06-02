import React, { useEffect } from "react";

import { useRouter } from "next/router";
import { FiChevronLeft } from "react-icons/fi";

import { OrderDetails } from "components/orders/OrderDetails";
import { OrderFeed } from "components/orders/OrderFeed";
import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useGetOrderFromQuery } from "hooks/useGetOrderFromQuery";
import { useTypedUpdateQuery } from "hooks/ws/useTypedUpdateQuery";
import { useWs } from "hooks/ws/useWs";
import { routes } from "lib/manifests/routes";
import { useToastStore } from "stores/useToastStore";
import type { PageComponent } from "types/tsx";

interface OrderPageProps {}

const OrderPage: PageComponent<OrderPageProps> = () => {
  const {
    data: order,
    isError,
    refetch,
  } = useGetOrderFromQuery({ keepPreviousData: true });
  const updateQuery = useTypedUpdateQuery();

  const { conn } = useWs();
  const { hideToast } = useToastStore();

  const { push } = useRouter();

  useEffect(() => {
    if (!conn || !order) return;

    const unsub = conn.listenFor(
      "order_event",
      ({ orderComposedId, event }) => {
        updateQuery(["getMyOrder", orderComposedId], (data) => ({
          ...data,
          events: [...data.events, event],
        }));

        if (event.type !== "message") {
          refetch();
          hideToast();
        }
      }
    );

    return () => unsub();
  }, [conn, hideToast, order, refetch, updateQuery]);

  if (isError) {
    push(routes.notFound);
  }

  if (!order) {
    return <Loader tw="py-30" centered />;
  }

  return (
    <Page title="Order">
      <Box tw="bg-gray-25">
        <Container tw="pt-4 pb-10">
          <Flex tw="mb-2">
            <Link href={routes.me.orders} tw="underline" variant="dimToLight">
              <Text size="13" tw="flex items-center gap-1">
                <FiChevronLeft tw="mt-0.1" />{" "}
                <Text as="span">Back to your orders</Text>
              </Text>
            </Link>
          </Flex>
          <Flex itemsCenter tw="w-full gap-4">
            <OrderFeed order={order} />
            <OrderDetails order={order} />
          </Flex>

          {/* <pre>{JSON.stringify(order, null, 2)}</pre> */}
        </Container>
      </Box>
    </Page>
  );
};

OrderPage.requiresAuth = true;

export default OrderPage;

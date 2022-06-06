import React, { useEffect, useRef } from "react";

import { useIntersectionObserver } from "@react-hookz/web";
import { useRouter } from "next/router";

import type { IOrderPreview } from "@neftie/common";
import { OrderStatus } from "components/pills/OrderStatus";
import { EthPrice } from "components/typography/EthPrice";
import { Box } from "components/ui/Box";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { User } from "components/users/User";
import { useTypedInfQuery } from "hooks/http/useTypedInfQuery";
import { routes } from "lib/manifests/routes";
import { hasPaginatedItems } from "utils/misc";

interface OrdersTableProps {
  entity: "Seller" | "Client";
  setLoading: (v: boolean) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  entity,
  setLoading,
}) => {
  const {
    data: orders,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useTypedInfQuery(
    ["getMyOrders", entity],
    { getNextPageParam: (lastPage) => lastPage.meta?.cursor },
    { as: entity.toLowerCase() as "seller" | "client" }
  );

  const elementRef = useRef<HTMLTableRowElement>(null);
  const intersection = useIntersectionObserver(elementRef);

  const { push } = useRouter();

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (intersection?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    intersection?.isIntersecting,
    isFetchingNextPage,
  ]);

  const heading: Record<typeof entity, string[]> = {
    Client: ["Seller", "Listing", "Last activity", "Total", "Status"],
    Seller: ["Client", "Listing", "Last activity", "Total", "Status"],
  };

  return (
    <Flex column>
      {hasPaginatedItems(orders) ? (
        <>
          <table tw="w-full">
            <thead>
              <tr>
                {heading[entity].map((h) => (
                  <th key={h} tw="py-1 border-t border-b border-gray-100">
                    <Text
                      weight="medium"
                      size="13"
                      color="gray500"
                      align="left"
                    >
                      {h}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody tw="divide-y divide-gray-100">
              {orders?.pages.map((page, i) => (
                <React.Fragment key={i}>
                  {page.items.map((order: IOrderPreview) => (
                    <tr
                      key={order.id}
                      tw="hover:bg-gray-25 bg-white cursor-pointer"
                      onClick={() =>
                        push(routes.order(order.listing.id, order.id).index)
                      }
                    >
                      <td tw="py-1">
                        <User
                          user={
                            order[entity.toLowerCase() as "seller" | "client"]
                          }
                          size="sm"
                        />
                      </td>
                      <td>
                        <Link
                          href={routes.order(order.listing.id, order.id).index}
                          underline
                        >
                          {order.listing.title}
                        </Link>
                      </td>
                      <td>
                        {new Date(
                          Number(order.lastEventAt) * 1000
                        ).toLocaleString()}
                      </td>
                      <td>
                        <EthPrice price={order.listing.price} />
                      </td>
                      <td>
                        <OrderStatus
                          status={order.status}
                          underRevision={false}
                        />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {isFetchingNextPage ? (
                <tr ref={elementRef} tw="">
                  <td colSpan={5} tw="py-4">
                    <Loader centered />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>

          <Box ref={elementRef} tw="w-full py-4">
            {isFetchingNextPage ? <Loader centered /> : null}
          </Box>
        </>
      ) : (
        <Text tw="py-3" align="center">
          No orders to show
        </Text>
      )}
    </Flex>
  );
};

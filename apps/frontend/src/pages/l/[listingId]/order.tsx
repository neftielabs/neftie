import React, { useCallback } from "react";

import { constTrue } from "fp-ts/lib/function";
import { useRouter } from "next/router";

import { areAddressesEqual } from "@neftie/common";
import { TransactionLayout } from "components/layout/transactions/TransactionLayout";
import { PlaceOrderPage } from "components/orders/PlaceOrderPage";
import { Page } from "components/Page";
import { Button } from "components/ui/Button";
import { Link } from "components/ui/Link";
import { Loader } from "components/ui/Loader";
import { useOrderPlaced } from "hooks/contracts/useOrderPlaced";
import { usePlaceOrder } from "hooks/contracts/usePlaceOrder";
import { useAuth } from "hooks/useAuth";
import { useGetListingFromQuery } from "hooks/useGetListingFromQuery";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

interface OrderConfirmationPageProps {}

const OrderConfirmationPage: PageComponent<OrderConfirmationPageProps> = () => {
  const { push } = useRouter();

  const { connectedAddress } = useAuth();
  const { data: listing, isError } = useGetListingFromQuery();

  const { mutateAsync: placeOrder, isLoading: isPlacingOrder } =
    usePlaceOrder(listing);
  const { status, handleOrderPlaced, txHash } = useOrderPlaced();

  const handleSubmit = useCallback(async () => {
    const { tx, orderListing } = await placeOrder(null);
    handleOrderPlaced(orderListing.id, tx.hash);
  }, [handleOrderPlaced, placeOrder]);

  if (
    isError ||
    (connectedAddress &&
      listing &&
      areAddressesEqual(listing.seller.id, connectedAddress))
  ) {
    push(routes.notFound);
  }

  if (!listing) {
    return <Loader centered tw="py-30" />;
  }

  return (
    <Page title="Order a service">
      <TransactionLayout
        formikProps={{
          onSubmit: handleSubmit,
          initialValues: {},
        }}
        transaction={{
          status,
          hash: txHash,
          pending: {
            title: "Placing order",
            subtitle: "Waiting for the transaction confirmation, hold tight!",
          },
          confirmed: {
            title: "Order placed!",
            subtitle:
              "You can now track the order status and message the seller in the order page",
            component: (
              <Link>
                <Button type="button" spring size="lg">
                  Go to order page
                </Button>
              </Link>
            ),
          },
        }}
        screens={[
          [
            constTrue,
            () => (
              <PlaceOrderPage listing={listing} isTxLoading={isPlacingOrder} />
            ),
          ],
        ]}
      />
    </Page>
  );
};

OrderConfirmationPage.requiresAuth = true;

export default OrderConfirmationPage;

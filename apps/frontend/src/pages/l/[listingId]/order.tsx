import React from "react";

import { useRouter } from "next/router";

import { Page } from "components/Page";
import { Container } from "components/ui/Container";
import { useGetListingFromQuery } from "hooks/useGetListingFromQuery";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

interface OrderConfirmationPageProps {}

const OrderConfirmationPage: PageComponent<OrderConfirmationPageProps> = () => {
  const { data: listing, isError } = useGetListingFromQuery();
  const { push } = useRouter();

  if (isError) {
    push(routes.notFound);
  }

  return (
    <Page title="Order a service">
      <Container>{/* <ListingCard /> */}</Container>
    </Page>
  );
};

OrderConfirmationPage.requiresAuth = true;

export default OrderConfirmationPage;

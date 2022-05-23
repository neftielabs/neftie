import React, { useCallback, useEffect, useState } from "react";

import { constTrue } from "fp-ts/lib/function";
import type { Asserts } from "yup";

import { listingSchema } from "@neftie/common";
import { TransactionLayout } from "components/layout/transactions/TransactionLayout";
import { ListingPreviewCard } from "components/listings/form/ListingPreviewCard";
import { NewListing } from "components/listings/form/NewListing";
import { Page } from "components/Page";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { useCreateListing } from "hooks/contracts/useCreateListing";
import { useListingCreated } from "hooks/contracts/useListingCreated";
import { useGetUser } from "hooks/queries/useGetUser";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

interface CreatePageProps {}

const CreatePage: PageComponent<CreatePageProps> = () => {
  const [txHash, setTxHash] = useState<string>();

  const { data: user } = useGetUser({ from: { currentUser: true } });
  const { mutateAsync: createListing } = useCreateListing();
  const [{ status, address: listingAddress }, handleListingCreated] =
    useListingCreated();

  const handleSubmit = useCallback(
    async (data: Asserts<typeof listingSchema["createOnChainListing"]>) => {
      const { address, tx } = await createListing(data);

      setTxHash(tx.hash);
      handleListingCreated(address);
    },
    [createListing, handleListingCreated]
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [status]);

  return (
    <Page title="Create a listing">
      <TransactionLayout<Asserts<typeof listingSchema["createOnChainListing"]>>
        formikProps={{
          onSubmit: handleSubmit,
          validationSchema: listingSchema.createOnChainListing,
          initialValues: {
            title: "",
            price: 0.1,
            bondFee: 0,
            deliveryDays: 1,
            revisions: 0,
          },
        }}
        transaction={{
          status,
          hash: txHash,
          pending: {
            title: "Creating listing",
            subtitle: "Waiting for the transaction confirmation, hold tight!",
          },
          confirmed: {
            title: "Listing created!",
            subtitle: "You can now add more details and start receiving orders",
            component: (
              <Flex column itemsCenter tw="w-3/4 gap-4">
                <ListingPreviewCard address={listingAddress} />
                <Link href={routes.listing(listingAddress).edit}>
                  <Button type="button" spring size="lg">
                    Edit listing
                  </Button>
                </Link>
              </Flex>
            ),
          },
        }}
        screens={[
          [constTrue, (s) => <NewListing user={user} formikState={s} />],
        ]}
      />
    </Page>
  );
};

CreatePage.requiresAuth = true;

export default CreatePage;

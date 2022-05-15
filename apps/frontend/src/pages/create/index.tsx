import { Page } from "components/Page";
import { listingSchema } from "@neftie/common";
import React, { useCallback, useState } from "react";
import { useCreateListing } from "hooks/contracts/useCreateListing";
import { TransactionLayout } from "components/layout/transactions/TransactionLayout";
import { Asserts } from "yup";
import { constTrue } from "fp-ts/lib/function";
import { NewListing } from "components/listings/creation/NewListing";
import { useListingCreated } from "hooks/contracts/useListingCreated";
import { ListingPreview } from "components/listings/creation/ListingPreview";
import { PageComponent } from "types/tsx";
import { useGetUser } from "hooks/queries/useGetUser";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";

interface CreatePageProps {}

const CreatePage: PageComponent<CreatePageProps> = () => {
  const [txHash, setTxHash] = useState<string>();

  const { user } = useGetUser({ currentUser: true });
  const { mutateAsync: createListing } = useCreateListing();
  const [{ status, address: listingAddress }, handleListingCreated] =
    useListingCreated();

  const handleSubmit = useCallback(
    async (data: Asserts<typeof listingSchema["createOnChainListing"]>) => {
      const { address, tx } = await createListing(data);

      setTxHash(tx.hash);
      handleListingCreated(address);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [createListing, handleListingCreated]
  );

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
                <ListingPreview address={listingAddress} />
                <Link href="">
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

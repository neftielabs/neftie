import { Page } from "components/Page";
import { useUser } from "hooks/useUser";
import { listingSchema } from "@neftie/common";
import React, { useCallback, useState } from "react";
import { useCreateListing } from "hooks/contracts/useCreateListing";
import { TransactionLayout } from "components/layout/transactions/TransactionLayout";
import { Asserts } from "yup";
import { constTrue } from "fp-ts/lib/function";
import { NewListing } from "components/listings/creation/NewListing";
import { useListingCreated } from "hooks/contracts/useListingCreated";

interface CreatePageProps {}

const CreatePage: React.FC<CreatePageProps> = () => {
  const [user] = useUser();
  const { mutateAsync: createListing } = useCreateListing();
  const [{ status }, handleListingCreated] = useListingCreated();
  const [txHash, setTxHash] = useState<string>();

  const handleSubmit = useCallback(
    async (data: Asserts<typeof listingSchema["createOnChainListing"]>) => {
      const { address, tx } = await createListing(data);
      setTxHash(tx.hash);
      handleListingCreated(address);
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
          status: "pending",
          hash: txHash,
          pending: {
            title: "Creating listing",
            subtitle: "Waiting for the transaction confirmation, hold tight!",
          },
          confirmed: {
            title: "Listing created",
            subtitle: "",
          },
        }}
        screens={[
          [constTrue, (s) => <NewListing user={user} formikState={s} />],
        ]}
      />
    </Page>
  );
};

export default CreatePage;

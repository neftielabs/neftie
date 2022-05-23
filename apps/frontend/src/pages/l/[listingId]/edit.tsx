import React, { useState } from "react";

import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import tw from "twin.macro";
import type { Asserts } from "yup";

import { areAddressesEqual, listingSchema } from "@neftie/common";
import { FileDropPreview } from "components/forms/file-drop/FileDropPreview";
import { ListingFormContainer } from "components/listings/form/ListingFormContainer";
import { ListingPreviewCard } from "components/listings/form/ListingPreviewCard";
import { Page } from "components/Page";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useTypedMutation } from "hooks/http/useTypedMutation";
import { useAuth } from "hooks/useAuth";
import { useGetListingFromQuery } from "hooks/useGetListingFromQuery";
import { routes } from "lib/manifests/routes";
import type { PageComponent } from "types/tsx";

interface ListingEditPageProps {}

const ListingEditPage: PageComponent<ListingEditPageProps> = () => {
  const { push } = useRouter();

  const [isUpdatingCover, setIsUpdatingCover] = useState(false);

  const { data: listing, isError, refetch } = useGetListingFromQuery();
  const { connectedAddress } = useAuth();

  const { mutateAsync: updateListing } = useTypedMutation("updateListing");

  if (
    isError ||
    (listing && !areAddressesEqual(listing.seller.id, connectedAddress ?? ""))
  ) {
    push(routes.notFound);
  }

  if (!listing) {
    return <Loader centered tw="py-30" />;
  }

  const handleSubmit = async (
    values: Asserts<typeof listingSchema["editListing"]>
  ) => {
    try {
      await updateListing([listing.id, values]);
      refetch();
    } catch {}
  };

  return (
    <Page title="Edit your listing">
      <Container tw="pt-4 pb-10">
        <Text size="3xl" weight="bold" align="center" tw="mb-7">
          Edit listing
        </Text>

        <Formik
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={listingSchema.editListing}
          initialValues={{
            title: listing.title,
            price: Number(listing.price),
            bondFee: Number(listing.bondFee),
            deliveryDays: Number(listing.deliveryDays),
            revisions: Number(listing.revisions),

            coverUrl: listing.coverUrl || "",
            coverFile: null,
            description: listing.description || "",
          }}
        >
          {(formikState) => (
            <Flex tw="gap-10 mt-3">
              <Form tw="w-3/5">
                <ListingFormContainer
                  css={tw`w-full`}
                  description="The"
                  sections={[
                    {
                      title: "Overview",
                      items: [
                        {
                          name: "title",
                          type: "text",
                          label: "Title",
                          placeholder: "What will you be doing?",
                          disabled: true,
                          required: true,
                        },
                        {
                          name: "description",
                          textarea: true,
                          label: "Description",
                          placeholder:
                            "Provide a detailed description of the service you're offering",
                        },
                        ...[
                          listing.coverUrl && !isUpdatingCover ? (
                            <FileDropPreview
                              preview={listing.coverUrl}
                              onRemove={() => setIsUpdatingCover(true)}
                            />
                          ) : (
                            {
                              name: "coverUrl",
                              label: "Cover",
                              help: "Accepted formats: JPG, JPEG, PNG. Max size: 10 MB",
                              fileFieldName: "coverFile",
                            }
                          ),
                        ],
                      ],
                    },
                    {
                      title: "Pricing",
                      items: [
                        [
                          {
                            name: "price",
                            help: "How much will your service cost",
                            type: "number",
                            label: "Price",
                            placeholder: "0.5",
                            step: "0.01",
                            required: true,
                            containerProps: { css: tw`w-1/2` },
                            disabled: true,
                          },
                          {
                            name: "bondFee",
                            help: "A small charge in case something goes wrong",
                            type: "number",
                            label: "Bond fee",
                            placeholder: "0.001",
                            step: "0.0001",
                            containerProps: { css: tw`w-1/2` },
                            disabled: true,
                          },
                        ],
                      ],
                    },
                    {
                      title: "Details",
                      items: [
                        [
                          {
                            name: "deliveryDays",
                            help: "The maximum time it will take to deliver",
                            type: "number",
                            label: "Delivery days",
                            placeholder: "1",
                            required: true,
                            containerProps: { css: tw`w-1/2` },
                            disabled: true,
                          },
                          {
                            name: "revisions",
                            help: "The number of revisions a client can request",
                            type: "number",
                            label: "Revisions",
                            placeholder: "1",
                            required: true,
                            containerProps: { css: tw`w-1/2` },
                            disabled: true,
                          },
                        ],
                      ],
                    },
                  ]}
                >
                  <Box tw="mt-4">
                    <Button
                      size="lg"
                      type="submit"
                      spring
                      theme="gradientOrange"
                      isLoading={formikState.isSubmitting}
                    >
                      Submit
                    </Button>
                  </Box>
                </ListingFormContainer>
              </Form>

              <Box tw="w-2/5">
                <ListingPreviewCard listing={formikState.values} />
              </Box>
            </Flex>
          )}
        </Formik>
      </Container>
    </Page>
  );
};

ListingEditPage.requiresAuth = true;

export default ListingEditPage;

import React from "react";

import type { FormikProps } from "formik";
import tw from "twin.macro";
import type { Asserts } from "yup";

import type { UserSafe, listingSchema } from "@neftie/common";
import { ListingFormContainer } from "components/listings/form/ListingFormContainer";
import { ListingPreviewCard } from "components/listings/form/ListingPreviewCard";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";

interface NewListingProps {
  user?: UserSafe;
  formikState: FormikProps<
    Asserts<typeof listingSchema["createOnChainListing"]>
  >;
}

export const NewListing: React.FC<NewListingProps> = ({
  user,
  formikState,
}) => {
  if (!user) {
    return <Loader centered tw="py-30" />;
  }

  return (
    <Container tw="pt-4 pb-10">
      <Text size="3xl" weight="bold" align="center" tw="mb-7">
        Create a new listing
      </Text>

      <Flex tw="gap-10 mt-3">
        <ListingFormContainer
          description="Fill all required fields in this form in order to create your new
            listing on the Ethereum blockchain. Once verified, you'll be
            able to personalize it with off-chain data such as a description
            and cover image."
          notice="These values cannot be changed afterwards."
          sections={[
            {
              title: "Overview",
              items: [
                {
                  name: "title",
                  type: "text",
                  label: "Title",
                  placeholder: "What will you be doing?",
                  required: true,
                },
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
                  },
                  {
                    name: "bondFee",
                    help: "A small charge in case something goes wrong",
                    type: "number",
                    label: "Bond fee",
                    placeholder: "0.001",
                    step: "0.0001",
                    containerProps: { css: tw`w-1/2` },
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
                  },
                  {
                    name: "revisions",
                    help: "The number of revisions a client can request",
                    type: "number",
                    label: "Revisions",
                    placeholder: "1",
                    required: true,
                    containerProps: { css: tw`w-1/2` },
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
              Create listing
            </Button>
          </Box>
        </ListingFormContainer>

        <Box tw="w-2/5">
          <ListingPreviewCard listing={formikState.values} />
        </Box>
      </Flex>
    </Container>
  );
};

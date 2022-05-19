import React from "react";

import { NoticeBox } from "components/alerts/NoticeBox";
import { Input } from "components/forms/Input";
import { ListingPreviewCard } from "components/listings/creation/ListingPreviewCard";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Container } from "components/ui/Container";
import { Flex } from "components/ui/Flex";
import { Text } from "components/ui/Text";
import { FormikProps } from "formik";
import tw from "twin.macro";
import { Asserts } from "yup";

import { UserSafe, listingSchema } from "@neftie/common";

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
  return (
    <Container tw="pt-4 pb-10">
      <Text size="3xl" weight="bold" align="center" tw="mb-7">
        Create a new listing
      </Text>
      {user ? (
        <Flex tw="gap-10 mt-3">
          <Box tw="w-3/5">
            <Text color="gray500" tw="mb-2">
              Fill all required fields in this form in order to create your new
              listing on the Ethereum blockchain. Once verified, you&apos;ll be
              able to personalize it with off-chain data such as a description
              and cover image.
            </Text>

            <NoticeBox type="info" style="minimal" tw="mb-3">
              These values cannot be changed afterwards.
            </NoticeBox>

            <Text color="gray500" size="md" weight="bold" tw="mb-3">
              Overview
            </Text>
            <Flex column tw="gap-2.5">
              <Input
                name="title"
                type="text"
                label="Title"
                placeholder="What will you be doing?"
                required
              />
              {/*
          <Input
            name="description"
            textarea
            label="Description"
            placeholder="Provide a detailed description of the service you're offering"
            required
          /> */}

              {/* <FileDrop
            label="Cover"
            help="Accepted formats: JPG, JPEG, PNG. Max size: 10 MB"
            name="coverUri"
            fileFieldName="coverFile"
          /> */}
            </Flex>

            <Text color="gray500" size="md" weight="bold" tw="my-3">
              Pricing
            </Text>
            <Flex column tw="gap-2.5">
              <Flex tw="w-full gap-2">
                <Input
                  name="price"
                  help="How much will your service cost"
                  type="number"
                  label="Price"
                  placeholder="0.5"
                  step="0.01"
                  required
                  containerProps={{ css: tw`w-1/2` }}
                />
                <Input
                  name="bondFee"
                  help="A small charge in case something goes wrong"
                  type="number"
                  label="Bond fee"
                  placeholder="0.001"
                  step="0.0001"
                  containerProps={{ css: tw`w-1/2` }}
                />
              </Flex>
            </Flex>

            <Text color="gray500" size="md" weight="bold" tw="my-3">
              Details
            </Text>
            <Flex column tw="gap-2.5">
              <Flex tw="w-full gap-2">
                <Input
                  name="deliveryDays"
                  help="The maximum time it will take to deliver"
                  type="number"
                  label="Delivery days"
                  placeholder="1"
                  required
                  containerProps={{ css: tw`w-1/2` }}
                />
                <Input
                  name="revisions"
                  help="The number of revisions a client can request"
                  type="number"
                  label="Revisions"
                  placeholder="1"
                  required
                  containerProps={{ css: tw`w-1/2` }}
                />
              </Flex>

              <Box tw="mt-2">
                <Button
                  size="lg"
                  type="submit"
                  spring
                  theme="gradient"
                  // isLoading={isSubmitting}
                >
                  Create listing
                </Button>
              </Box>
            </Flex>
          </Box>
          <Box tw="w-2/5">
            <ListingPreviewCard listing={formikState.values} />
          </Box>
        </Flex>
      ) : null}
    </Container>
  );
};

import React, { useCallback } from "react";

import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import type { Asserts } from "yup";

import { meSchema } from "@neftie/common";
import { Input } from "components/forms/Input";
import { ModalController } from "components/modals/ModalController";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { Text } from "components/ui/Text";
import { useClient } from "hooks/http/useClient";
import { useTypedMutation } from "hooks/http/useTypedMutation";
import { useGetUser } from "hooks/queries/useGetUser";
import { routes } from "lib/manifests/routes";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";

interface EditProfileModalProps {}

export const EditProfileModal: React.FC<EditProfileModalProps> = () => {
  const { data: user } = useGetUser({ from: { currentUser: true } });
  const client = useClient();
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutateAsync: updateProfile } = useTypedMutation("updateProfile");

  const handleSubmit = useCallback(
    async (data: Asserts<ReturnType<typeof meSchema["editProfile"]>>) => {
      try {
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => !!value)
        ) as typeof data;

        await updateProfile([cleanData]);

        if (cleanData.username && cleanData.username !== user?.username) {
          closeModal();
          router.push(routes.user(cleanData.username).index);
          return;
        }
        if (user) {
          queryClient.refetchQueries(["getUser", user.username]);
          queryClient.refetchQueries(["getUser", user.id]);
        }

        closeModal();
      } catch {}
    },
    [closeModal, queryClient, router, updateProfile, user]
  );

  return (
    <ModalController type={Modal.editProfile} tw="max-width[550px]">
      {!user ? (
        <Loader centered tw="py-10" />
      ) : (
        <Flex column tw="pt-4 pb-3 px-3">
          <Text size="xl" weight="bold">
            Edit profile
          </Text>
          <Text color="gray600" tw="mt-1 w-4/5">
            Edit your public facing details. Neftie can request proof that you
            actually own the social media handles.
          </Text>

          <Formik
            onSubmit={handleSubmit}
            initialValues={{
              name: user.name || "",
              username: user.username,
              twitter: user?.twitterHandle || "",
              website: user?.websiteUrl || "",
              location: user?.location || "",
              bio: "",
            }}
            validateOnChange={false}
            validationSchema={meSchema.editProfile(user.username, (username) =>
              client.query.checkUsernameAvailable(username)
            )}
          >
            {({ isSubmitting }) => (
              <Form tw="mt-2">
                <Input
                  type="text"
                  name="name"
                  label="Name"
                  labelProps={{ size: "base" }}
                  placeholder="John Doe"
                />

                <Flex tw="w-full gap-2 mt-2">
                  <Input
                    type="text"
                    name="username"
                    label="Username"
                    labelProps={{ size: "base" }}
                  />
                  <Input
                    type="text"
                    name="location"
                    label="Location"
                    labelProps={{ size: "base" }}
                  />
                </Flex>

                <Flex tw="w-full gap-2 mt-2">
                  <Input
                    type="text"
                    name="twitter"
                    label="Twitter handle"
                    labelProps={{ size: "base" }}
                    placeholder="jack"
                  />
                  <Input
                    type="text"
                    name="website"
                    label="Website URL"
                    labelProps={{ size: "base" }}
                    placeholder="neftie.io"
                  />
                </Flex>
                <Button tw="mt-2" type="submit" isLoading={isSubmitting}>
                  Save changes
                </Button>
              </Form>
            )}
          </Formik>
        </Flex>
      )}
    </ModalController>
  );
};

import React, { useCallback, useState } from "react";

import { Form, Formik } from "formik";
import {
  FiClock,
  FiEdit2,
  FiGlobe,
  FiHash,
  FiMapPin,
  FiSquare,
  FiTwitter,
  FiX,
} from "react-icons/fi";
import { useQueryClient } from "react-query";
import tw from "twin.macro";
import { useEnsName } from "wagmi";
import type { Asserts } from "yup";

import type { UserFullSafe } from "@neftie/common";
import { areAddressesEqual, meSchema } from "@neftie/common";
import { Input } from "components/forms/Input";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Link } from "components/ui/Link";
import { Text } from "components/ui/Text";
import { useTypedMutation } from "hooks/http/useTypedMutation";
import { useAuth } from "hooks/useAuth";
import { onlyTrue } from "utils/fp";
import { shortenAddress } from "utils/web3";

interface BioProps {
  isEditing: boolean;
  content?: string | null;
  onEditFinish?: () => void;
}

export const Bio: React.FC<BioProps> = ({
  isEditing,
  content = "",
  onEditFinish,
}) => {
  const { mutateAsync: updateProfile } = useTypedMutation("updateProfile");

  const handleSubmit = useCallback(
    async (data: Asserts<ReturnType<typeof meSchema["editProfile"]>>) => {
      try {
        await updateProfile([data] as any); // The compiler fails here for no reason
        onEditFinish?.();
      } catch {}
    },
    [onEditFinish, updateProfile]
  );

  return (
    <>
      {isEditing ? (
        <Formik
          onSubmit={handleSubmit}
          validationSchema={meSchema.editProfile()}
          initialValues={{ bio: content ?? "" } as any}
        >
          {({ isSubmitting }) => (
            <Form tw="w-full relative">
              <Input
                name="bio"
                tw="w-full"
                textarea
                placeholder="Tell the 🌍 about yourself"
              />
              <Flex itemsCenter tw="justify-end gap-2">
                <Button
                  type="submit"
                  size="none"
                  tw="px-2 py-1 mt-1"
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          {content ? (
            <Text tw="white-space[pre-wrap]">{content}</Text>
          ) : (
            <Text color="gray400" tw="italic">
              No bio available
            </Text>
          )}
        </>
      )}
    </>
  );
};

interface ProfileAboutProps {
  user: UserFullSafe;
}

export const ProfileAbout: React.FC<ProfileAboutProps> = ({ user }) => {
  const { connectedAddress } = useAuth();
  const [isEditingBio, setIsEditingBio] = useState(false);

  const queryClient = useQueryClient();

  const { data: ensName } = useEnsName({
    address: user.id,
  });

  return (
    <>
      <Flex itemsCenter tw="gap-2 mb-2">
        <Text size="lg" weight="bold">
          About {user.name || user.username}
        </Text>

        {onlyTrue(
          <Button
            size="none"
            theme="gray"
            tw="text-gray-500 px-1.3 py-0.5 mt-0.2"
            type="button"
            onClick={() => setIsEditingBio(!isEditingBio)}
          >
            <Flex itemsCenter tw="gap-0.7">
              {isEditingBio ? <FiX size="11" /> : <FiEdit2 size="11" />}
              <Text tw="font-size[11px]">
                {isEditingBio ? "Cancel" : "Edit"}
              </Text>
            </Flex>
          </Button>
        )(areAddressesEqual(connectedAddress, user.id))}
      </Flex>

      <Flex tw="w-1/2">
        <Bio
          content={user.bio}
          isEditing={isEditingBio}
          onEditFinish={() => {
            setIsEditingBio(false);
            queryClient.refetchQueries(["getUser", user.username]);
            queryClient.refetchQueries(["getUser", user.id]);
          }}
        />
      </Flex>

      <Flex column tw="mt-3 gap-1">
        {(
          [
            [shortenAddress(user.id), <FiHash key="user" />, null],
            [user.location, <FiMapPin key="location" />, null],
            [
              user.twitterHandle,
              <FiTwitter key="twitter" />,
              `https://twitter.com/${user.twitterHandle}`,
            ],
            [
              user.websiteUrl,
              <FiGlobe key="website" />,
              `https://${user.websiteUrl}`,
            ],
            [ensName, <FiSquare key="ens" tw="transform rotate-45" />, null],
            [
              `Since ${new Intl.DateTimeFormat("default", {
                month: "long",
                year: "numeric",
              }).format(new Date(user.createdAt))}`,
              <FiClock key="since" />,
              null,
            ],
          ] as const
        ).map((e) => (
          <React.Fragment key={e[0]}>
            {onlyTrue(
              e[2] ? (
                <Link href={e[2]} rel="noreferrer" target="_blank">
                  <Flex tw="gap-0.7" itemsCenter>
                    {React.cloneElement(e[1], {
                      css: tw`text-gray-900`,
                      size: 17,
                      strokeWidth: 2.2,
                    })}
                    <Text weight="medium">{e[0]}</Text>
                  </Flex>
                </Link>
              ) : (
                <Flex tw="gap-0.7" itemsCenter>
                  {React.cloneElement(e[1], {
                    css: tw`text-gray-900`,
                    size: 17,
                    strokeWidth: 2.2,
                  })}
                  <Text weight="medium">{e[0]}</Text>
                </Flex>
              )
            )(!!e[0])}
          </React.Fragment>
        ))}
      </Flex>
    </>
  );
};

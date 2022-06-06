import React, { useCallback } from "react";

import { serialize } from "bson";
import { Form, Formik } from "formik";
import { FiPaperclip } from "react-icons/fi";

import { orderSchema } from "@neftie/common";
import { FileDropPreview } from "components/forms/file-drop/FileDropPreview";
import { Input } from "components/forms/Input";
import { Avatar } from "components/media/Avatar";
import { FileDropModal } from "components/modals/FileDropModal";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { useGetUser } from "hooks/queries/useGetUser";
import { useWs } from "hooks/ws/useWs";
import { useModalStore } from "stores/useModalStore";
import { Modal } from "types/modals";
interface OrderMessageBoxProps {
  isSeller?: boolean;
  orderId: string;
}

export const OrderMessageBox: React.FC<OrderMessageBoxProps> = ({
  isSeller,
  orderId,
}) => {
  const { data: user } = useGetUser({ from: { currentUser: true } });
  const { conn } = useWs();

  const { setActiveModal, closeModal } = useModalStore();

  const handleSubmit = useCallback(
    async (message: string, attachment: any, resetForm: () => void) => {
      let fileBuffer: Buffer | null = null;

      if (attachment) {
        const file = attachment as File;
        fileBuffer = Buffer.from(await file.arrayBuffer());
      }

      return new Promise((resolve, reject) => {
        if (!conn) {
          reject(new Error("No connection"));
          return;
        }

        if (fileBuffer) {
          const bsonData = serialize({
            op: "order_message",
            d: {
              message,
              orderComposedId: orderId,
              file: fileBuffer,
            },
          });

          conn.sendBinary(bsonData);
          resetForm();
        } else {
          resolve(
            conn.send("order_message", {
              message,
              orderComposedId: orderId,
              file: undefined,
            })
          );
          resetForm();
        }
      });
    },
    [conn, orderId]
  );

  return (
    <Flex tw="gap-2 items-start w-full pr-3 pl-2.5">
      <Avatar
        size="md"
        tw="border-0.5 border-white flex-shrink-0"
        avatarUrl={user?.avatarUrl}
      />
      <Formik
        enableReinitialize
        onSubmit={(v, a) => handleSubmit(v.message, v.file, a.resetForm)}
        validationSchema={orderSchema.orderMessage}
        initialValues={{
          message: "",
          orderComposedId: orderId,
          file: null,
          fileUri: "",
        }}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {(formikState) => (
          <Form tw="w-full">
            <Input
              name="message"
              textarea
              tw="resize-none pb-6"
              placeholder={`Send your ${
                isSeller ? "client" : "seller"
              } a message`}
            >
              <Flex
                justifyBetween
                itemsCenter
                tw="absolute bottom-1 w-full px-1"
              >
                <Flex tw="pl-1">
                  <Button
                    type="button"
                    raw
                    tw="bg-gray-100 px-0.7 py-0.5 rounded-md hover:bg-gray-150"
                    onClick={() => setActiveModal(Modal.fileDrop)}
                  >
                    <FiPaperclip />
                  </Button>
                </Flex>
                <Button
                  size="sm"
                  text="13"
                  type="submit"
                  isLoading={formikState.isSubmitting}
                  loader={<Loader absoluteCentered svgProps={{ width: 15 }} />}
                >
                  Send
                </Button>
              </Flex>
            </Input>

            {formikState.values.fileUri ? (
              <FileDropPreview
                preview={formikState.values.fileUri}
                onRemove={() =>
                  formikState.setValues({
                    ...formikState.values,
                    file: null,
                    fileUri: "",
                  })
                }
                tw="w-20"
                imageProps={{ css: { height: 120 } }}
              />
            ) : null}

            <FileDropModal
              name="fileUri"
              fileFieldName="file"
              label="Attach an image"
              help="Caution! Do not send delivery-ready files before delivering your order. Watermarking is coming soon."
              maxSize={3 * 1000000}
              onFileDrop={() => closeModal()}
            />
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

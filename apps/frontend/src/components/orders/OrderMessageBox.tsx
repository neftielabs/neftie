import React, { useCallback } from "react";

import { Form, Formik } from "formik";

import { orderSchema } from "@neftie/common";
import { Input } from "components/forms/Input";
import { Avatar } from "components/media/Avatar";
import { Button } from "components/ui/Button";
import { Flex } from "components/ui/Flex";
import { Loader } from "components/ui/Loader";
import { useGetUser } from "hooks/queries/useGetUser";
import { useWs } from "hooks/ws/useWs";

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
  const handleSubmit = useCallback(
    (message: string, resetForm: () => void) =>
      new Promise((resolve, reject) => {
        if (!conn) {
          reject(new Error("No connection"));
          return;
        }

        resolve(
          conn.send("order_message", { message, orderComposedId: orderId })
        );
        resetForm();
      }),
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
        onSubmit={(v, a) => handleSubmit(v.message, a.resetForm)}
        validationSchema={orderSchema.orderMessage}
        initialValues={{ message: "", orderComposedId: orderId }}
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
              <Button
                tw="absolute right-1 bottom-1"
                size="sm"
                text="13"
                type="submit"
                isLoading={formikState.isSubmitting}
                loader={<Loader absoluteCentered svgProps={{ width: 15 }} />}
              >
                Send
              </Button>
            </Input>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

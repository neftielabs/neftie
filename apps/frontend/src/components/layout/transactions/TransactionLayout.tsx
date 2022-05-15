import { TransactionConfirmed } from "components/layout/transactions/TransactionConfirmed";
import { TransactionPending } from "components/layout/transactions/TransactionPending";
import { Form, Formik, FormikConfig, FormikProps } from "formik";
import { guard } from "fp-ts-std/Function";
import { Predicate } from "fp-ts/lib/Predicate";
import React from "react";
import { TransactionStatus } from "types/tx";

interface TransactionLayoutProps<T> {
  formikProps: FormikConfig<T>;
  screens: [
    Predicate<FormikProps<T>>,
    (x: FormikProps<T>) => JSX.Element | null
  ][];
  transaction: {
    hash?: string;
    status: TransactionStatus;
    pending: {
      title: string;
      subtitle: string;
    };
    confirmed: {
      title: string;
      subtitle: string;
      component?: JSX.Element;
    };
  };
}

export function TransactionLayout<T>({
  formikProps,
  screens,
  transaction,
}: TransactionLayoutProps<T>) {
  return (
    <Formik<T>
      {...formikProps}
      onSubmit={formikProps.onSubmit}
      initialValues={formikProps.initialValues}
      validationSchema={formikProps.validationSchema}
      enableReinitialize
    >
      {(state) => (
        <Form>
          {guard<FormikProps<T>, JSX.Element | null>([
            [
              () => transaction.status === "pending",
              () => (
                <TransactionPending
                  title={transaction.pending.title}
                  subtitle={transaction.pending.subtitle}
                  txHash={transaction.hash}
                />
              ),
            ],
            [
              () => transaction.status === "confirmed",
              () => (
                <TransactionConfirmed
                  title={transaction.confirmed.title}
                  subtitle={transaction.confirmed.subtitle}
                  txHash={transaction.hash}
                >
                  {transaction.confirmed.component}
                </TransactionConfirmed>
              ),
            ],
            ...screens,
          ])(() => null)(state)}
        </Form>
      )}
    </Formik>
  );
}

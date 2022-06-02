import * as yup from "yup";

import { OrderEventType as OrderEventTypeEnum } from "@neftie/subgraph";

import type { OrderEventType } from "../types";

export const verifyOrderSchema = yup.object({
  txHash: yup
    .string()
    .matches(/^0x([A-Fa-f0-9]{64})$/)
    .required(),
});

export const entityOrdersSchema = yup.object({
  as: yup
    .mixed<"seller" | "client">()
    .oneOf(["seller", "client"])
    .required()
    .default("seller"),
});

export const orderMessage = yup.object({
  orderComposedId: yup.string().required(),
  message: yup.string().min(1).max(500).required(),
});

export const newOrderAction = yup.object({
  orderComposedId: yup.string().required(),
  timestamp: yup.number().notRequired(),
  action: yup
    .mixed<OrderEventType>()
    .oneOf(Object.values(OrderEventTypeEnum))
    .required(),
});

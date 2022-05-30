import * as yup from "yup";

export const verifyOrderSchema = yup.object({
  txHash: yup
    .string()
    .matches(/^0x([A-Fa-f0-9]{64})$/)
    .required(),
});

export const entityOrdersSchema = yup.object({
  as: yup.string().oneOf(["seller", "client"]).required().default("seller"),
});

export const orderMessage = yup.object({
  orderComposedId: yup.string().required(),
  message: yup.string().min(1).max(500).required(),
});

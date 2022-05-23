import * as yup from "yup";

export const verifyOrderSchema = yup.object({
  txHash: yup
    .string()
    .matches(/^0x([A-Fa-f0-9]{64})$/)
    .required(),
});

export const userOrdersSchema = yup.object({
  role: yup.string().oneOf(["seller", "client"]).required().default("seller"),
});

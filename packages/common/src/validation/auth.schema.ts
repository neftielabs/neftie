import * as yup from "yup";

export const verifyPayload = yup.object({
  message: yup.string().required(),
  signature: yup.string().required(),
});

export const wsAuthMessage = yup.object({
  token: yup.string().required(),
});

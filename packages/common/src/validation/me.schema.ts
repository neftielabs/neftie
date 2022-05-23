import * as yup from "yup";

export const fileUpload = yup.object({
  entity: yup.string().oneOf(["avatar", "banner"]).required(),
});

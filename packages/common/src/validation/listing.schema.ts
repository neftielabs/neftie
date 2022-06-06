import * as yup from "yup";

export const createOnChainListing = yup.object({
  title: yup.string().min(15).max(50).required(),
  price: yup.number().required().min(0.0019),
  bondFee: yup.number().nullable(),
  deliveryDays: yup.number().required().max(10).min(1),
  revisions: yup.number().required().min(0).max(5),
});

export const editListing = yup.object({
  title: yup.string().min(15).max(50).required(),
  price: yup.number().required().min(0.0019),
  bondFee: yup.number().nullable(),
  deliveryDays: yup.number().required().max(10).min(1),
  revisions: yup.number().required().min(0).max(5),

  coverUrl: yup.string().notRequired(),
  coverFile: yup.mixed().notRequired(),
  description: yup.object().notRequired(),
  descriptionText: yup.string().notRequired().max(1000),
});

export const serverEditListing = yup.object({
  coverFile: yup.mixed().notRequired(),
  description: yup.string().notRequired(),
});

import * as yup from "yup";

const commonCreateListing = yup.object({
  description: yup.string().max(1000).required(),
  coverFile: yup.mixed().required(),
});

export const createOnChainListing = yup.object({
  title: yup.string().min(15).max(50).required(),
  price: yup.number().required().min(0.0019),
  bondFee: yup.number().nullable(),
  deliveryDays: yup.number().required().max(10).min(1),
  revisions: yup.number().required().min(0).max(5),
});

export const createListing = commonCreateListing.concat(
  yup.object({
    title: yup.string().min(15).max(50).required(),
    coverUri: yup.string().notRequired(),
    price: yup.number().required().min(0.0019),
    bondFee: yup.number().nullable(),
    deliveryDays: yup.number().required().max(10).min(1),
    revisions: yup.number().required().min(0).max(5),
  })
);

export const serverCreateListing = commonCreateListing.concat(
  yup.object({
    predictedAddress: yup.string().required(),
    txHash: yup.string().required(),
    nonce: yup.string().required(),
  })
);

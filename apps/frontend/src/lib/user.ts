import React from "react";

import axiosInstance from "lib/http/axiosInstance";

import { apiClient } from "@neftie/api-client";

export const handleProfileAssetUpload = async (
  ev: React.ChangeEvent<HTMLInputElement>,
  entity: "banner" | "avatar"
) => {
  const files = ev.target.files;

  if (!files?.length) {
    return;
  }

  const file = files[0];

  if (file.type && file.type.indexOf("image") === -1) {
    return;
  }

  const data = new FormData();
  data.append("file", file);

  // Call api

  await apiClient(axiosInstance).query.uploadAsset({
    entity,
    file: data,
  });
};

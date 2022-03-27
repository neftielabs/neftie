import { apiClient } from "@neftie/api-client";
import { useAxios } from "hooks/http/useAxios";
import { useMemo } from "react";

export const useClient = () => {
  const axios = useAxios();

  return useMemo(() => apiClient(axios), [axios]);
};

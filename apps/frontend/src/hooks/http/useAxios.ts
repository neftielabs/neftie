import { useContext } from "react";

import { AxiosContext } from "context/AxiosProvider";

export const useAxios = () => useContext(AxiosContext);

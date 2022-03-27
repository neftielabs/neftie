import { AxiosContext } from "context/AxiosProvider";
import { useContext } from "react";

export const useAxios = () => useContext(AxiosContext);

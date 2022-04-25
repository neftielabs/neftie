import { AxiosInstance } from "axios";
import axiosInstance from "lib/http/axiosInstance";
import React, { useMemo } from "react";

export const AxiosContext = React.createContext<AxiosInstance>(axiosInstance);

interface AxiosProviderProps {}

export const AxiosProvider: React.FC<AxiosProviderProps> = ({ children }) => {
  const axiosClient = useMemo(() => {
    const instance = axiosInstance;
    return instance;
  }, []);

  return (
    <AxiosContext.Provider value={axiosClient}>
      {children}
    </AxiosContext.Provider>
  );
};

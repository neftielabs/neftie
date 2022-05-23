import React, { useMemo } from "react";

import type { AxiosInstance } from "axios";

import axiosInstance from "lib/http/axiosInstance";

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

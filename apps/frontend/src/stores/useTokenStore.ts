import create from "zustand";
import { combine } from "zustand/middleware";

export type TokenObject = {
  value: string;
  address: string;
};

export const useTokenStore = create(
  combine(
    {
      token: null as TokenObject | null,
    },
    (set) => ({
      setToken: (token: TokenObject | null) => {
        set({ token });
      },
    })
  )
);

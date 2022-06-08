import create from "zustand";
import { combine } from "zustand/middleware";

export const useHeaderNoticeStore = create(
  combine(
    {
      open: true,
    },
    (set) => ({
      closeNotice: () => set({ open: false }),
    })
  )
);

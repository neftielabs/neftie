import create from "zustand";
import { combine } from "zustand/middleware";

import type { Modal } from "types/modals";

export const useModalStore = create(
  combine(
    {
      activeModal: null as Modal | null,
    },
    (set) => ({
      closeModal: () => set({ activeModal: null }),
      setActiveModal: (activeModal: Modal) => {
        set({ activeModal });
      },
    })
  )
);

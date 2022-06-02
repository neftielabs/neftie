import create from "zustand";
import { combine } from "zustand/middleware";

type Toast = {
  message: string;
  isLoading?: boolean;
  duration?: number;
};

export const useToastStore = create(
  combine(
    {
      toast: null as Toast | null,
      state: "closed" as "open" | "closing" | "closed",
    },
    (set, state) => ({
      hideToast: () => {
        if (!state().toast) {
          set({ toast: null, state: "closed" });
          return;
        }

        set({ state: "closing" });

        setTimeout(() => {
          set({ toast: null, state: "closed" });
        }, 500);
      },
      showToast: (t: Toast) => {
        if (state().toast) {
          set({ state: "closing" });

          setTimeout(() => {
            set({ toast: t, state: "open" });
          }, 500);

          return;
        }

        set({ toast: t, state: "open" });
      },
    })
  )
);

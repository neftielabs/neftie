import { apiClient } from "@neftie/api-client";
import { UserSafe } from "@neftie/common";
import axiosInstance from "lib/axiosInstance";
import create from "zustand";
import { combine } from "zustand/middleware";

export const useUserStore = create(
  combine(
    {
      user: null as UserSafe | null,
      isFetchingUser: false,
      hasFetchedUser: false,
    },
    (set) => {
      const client = apiClient(axiosInstance);

      return {
        /**
         * Sets the user object
         */
        setUser: (user: UserSafe | null) => set({ user }),

        /**
         * Fetches the current user from the API.
         * Note: doesn't set the user, returns the promise
         */
        requestUser: async () => await client.query.user.getMe(),

        /**
         * Fetches the current user from the API and updates
         * the store
         */
        fetchUser: async () => {
          set({ isFetchingUser: true });

          try {
            const { user } = await client.query.user.getMe();
            set({ user });
            return !!user;
          } catch {
            set({ user: null });
            return false;
          } finally {
            set({ isFetchingUser: false, hasFetchedUser: true });
          }
        },

        /**
         * Store setter
         */
        set,
      };
    }
  )
);

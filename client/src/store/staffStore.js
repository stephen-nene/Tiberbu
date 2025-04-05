import {create} from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apiClient1 } from "../services/apiClient";
import { toast } from "sonner";

export const staffStore = create(
  devtools(
    persist(
      (set, get) => ({
        doctors: null,
        specializations: [],
        patients: null,
        loading: false,

        fetchUsers: async (filters) => {
          const toastId = toast.loading("Fetching users...");
          set({ loading: true });
          try {
            const response = await apiClient1.get("/profiles/users/", {
              params: filters,
            });

            // Log the response for debugging
            console.log("Response:", response);

            if (response.status === 200 || response.status === 202) {
              set({ doctors: response.data });
              toast.success("Users fetched successfully!", { id: toastId });
            } else {
              toast.error(`Failed to fetch users. Status: ${response.status}`, {
                id: toastId,
              });
            }
          } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users", { id: toastId });
          } finally {
            set({ loading: false });
          }
        },

        fetchSpecializations: async () => {
          const toastId = toast.loading("Fetching specializations...");
          set({ loading: true });
          try {
            const response = await apiClient1.get(
              "/management/specializations/"
            );

            // Log the response for debugging
            console.log("Response:", response);

            if (response.status === 200 || response.status === 202) {
              set({ specializations: response.data });
              toast.success("Specializations fetched successfully!", {
                id: toastId,
              });
            } else {
              toast.error(
                `Failed to fetch specializations. Status: ${response.status}`,
                { id: toastId }
              );
            }
          } catch (error) {
            console.error("Error fetching specializations:", error);
            toast.error("Failed to fetch specializations", { id: toastId });
          } finally {
            set({ loading: false });
          }
        },
      }),
      {
        name: "staff-storage",
        partialize: (state) => ({
        //   doctors: state.doctors,
          specializations: state.specializations,
        //   loading: state.loading,
        }),
      }
    )
  )
);


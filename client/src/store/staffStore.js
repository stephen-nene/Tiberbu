import {create} from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apiClient1 } from "../services/apiClient";
import { toast } from "sonner";

export const staffStore = create(
  devtools(
    persist(
      (set, get) => ({
        doctors: [],
        specializations: [],
        patients: [],
        loading: false,

        fetchUsers: async (filters) => {
          const toastId = toast.loading(`Fetching ${filters.role}...`);
          set({ loading: true });
          try {
            const response = await apiClient1.get("/profiles/users/", {
              params: filters,
            });

            // Log the response for debugging
            // console.log("Response:", response);

            if (response.status === 200) {
              if (filters.role === "clinician") {
                // console.log("first")
                set({ doctors: response.data });
              } else if (filters.role === "patient") {
                set({ patients: response.data });
              }
              toast.success(`${filters.role} fetched successfully!`, {
                id: toastId,
              });
            } else {
              toast.error(
                `Failed to fetch ${filters.role}. Status: ${response.status}`,
                {
                  id: toastId,
                }
              );
            }
          } catch (error) {
            console.error(`Error fetching ${filters.role}`, error);
            toast.error(`Failed to fetch ${filters.role}`, { id: toastId });
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

        // save specialization and add to the list
        saveSpecialization: async (data) => {
          const toastId = toast.loading("Saving specialization...");
          set({ loading: true });
          try {
            const response = await apiClient1.post(
              "/management/specializations/",
              data
            );

            // Log the response for debugging
            console.log("Response:", response);
            if (response.status === 201) {
              set((state) => ({
                specializations: [...state.specializations, response.data],
              }));

              toast.success("Specialization saved successfully!", {
                id: toastId,
              });
              return response.status;
            }
          } catch (error) {
            console.error("Error saving specialization:", error);
            toast.error("Failed to save specialization", { id: toastId });
          } finally {
            toast.dismiss(toastId);
            set({ loading: false });
          }
        },

        // save doctor and add to the list

        // save atient and add to the list
        savePatient: async (data) => {
          set({ loading: true });
          try {
            const response = await apiClient1.post("/profiles/users/", data);
            if (response.status === 201) {
              set((state) => ({
                patients: [...state.patients, response.data],
              }));
              return response;
            }
          } catch (error) {
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        // update doctor and add to the list
        patchPatient: async (data) => {
          set({ loading: true });
          try {
            const response = await apiClient1.patch(
              `/profiles/users/${data.id}/`,
              data
            );
            if (response.status === 200) {
              set((state) => ({
                patients: state.patients.map((patient) =>
                  patient.id === data.id ? response.data : patient
                ),
              }))
              return response;
            }
          } catch (error) {
            throw error;
          } finally {
            set({ loading: false });
          }
        }
      }),
      {
        name: "staff-storage",
        partialize: (state) => ({
          //   doctors: state.doctors,
          // specializations: state.specializations,
          //   loading: state.loading,
        }),
      }
    )
  )
);


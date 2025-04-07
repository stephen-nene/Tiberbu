import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { apiClient1, apiClient2 } from "../services/apiClient";
import { toast } from "sonner";

export const manageStore = create(
  devtools(
    persist(
      (set, get) => ({
        specializations: [],
        availabilities: [],
        appointments: [],
            loading: false,
        
        // Get requests

        fetchAvailabilities: async () => {
          const toastId = toast.loading("Fetching availabilities...");
          set({ loading: true });
          try {
            const response = await apiClient1.get(
              "/management/availabilities/"
            );

            // Log the response for debugging
            console.log("Response:", response);

            if (response.status === 200) {
              set({ availabilities: response.data });
              toast.success("Availabilities fetched successfully!", {
                id: toastId,
              });
            } else {
              toast.error(
                `Failed to fetch availabilities. Status: ${response.status}`,
                { id: toastId }
              );
            }
          } catch (error) {
            console.error("Error fetching availabilities:", error);
            toast.error("Failed to fetch availabilities", { id: toastId });
          } finally {
            set({ loading: false });
          }
        },
        fetchAppointments: async (filters) => {
          const toastId = toast.loading(`Fetching appointments...`);
          set({ loading: true });
          try {
            const response = await apiClient1.get("/management/appointments/", {
              params: filters,
            });

            // Log the response for debugging
            console.log("Response:", response);

            if (response.status === 200) {
              set({ appointments: response.data });
              toast.success("Appointments fetched successfully!", {
                id: toastId,
              });
            } else {
              toast.error(
                `Failed to fetch appointments. Status: ${response.status}`,
                {
                  id: toastId,
                }
              );
            }
          } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("Failed to fetch appointments", { id: toastId });
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
        
            // Post requests
        createAvailability: async (data) => {
          const toastId = toast.loading("Saving availability...");
          set({ loading: true });
          try {
            const response = await apiClient1.post(
              "/management/availabilities/",
              data
            );

            return response;
          } catch (error) {
            // console.error("Error saving availability:", error);
            //   toast.error("Failed to save availability", { id: toastId });
              throw error;
          } finally {
            toast.dismiss(toastId);
            set({ loading: false });
          }
            },
        
            createAppointment: async (data) => { 
              const toastId = toast.loading("Saving appointment...");
              set({ loading: true });
              try {
                const response = await apiClient1.post(
                  "/management/appointments/",
                  data
                );
        
                // Log the response for debugging
                  console.log("Response:", response);
                  
                if (response.status === 201) {
                  toast.success("Appointment saved successfully!", {
                    id: toastId,
                  });
                  return response.status;
                }
              } catch (error) {
                console.error("Error saving appointment:", error);
                toast.error("Failed to save appointment", { id: toastId });
              } finally {
                // toast.dismiss(toastId);
                set({ loading: false });
              }
            },

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

        savePatient: async (data) => {
          set({ loading: true });
          try {
            const response = await apiClient1.post("/profiles/users/", data);
            if (response.status === 201) {
              // if role is patient else save to doctor
              if (response?.data?.role === "patient") {
                set((state) => ({
                  patients: [...state.patients, response.data],
                }));
              } else if (response?.data?.role === "clinician") {
                set((state) => ({
                  doctors: [...state.doctors, response.data],
                }));
              }

              return response;
            }
          } catch (error) {
            throw error;
          } finally {
            set({ loading: false });
          }
        },
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

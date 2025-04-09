import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { toast } from 'sonner';

import { apiClient1 } from "../services/apiClient";

export const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,

        accessToken: null,
        refreshToken: null,

        token: null,
        loggedIn: false,

        darkMode: false,

        // Get user info
        getUser: () => get().user,

        // Toggle Dark Mode
        toggleDarkMode: () => {
          set((state) => ({ darkMode: !state.darkMode }));
        },

        // Set user after login/signup
        setUser: (user, token, refreshToken, accessToken) => set({ user, loggedIn: true, accessToken, refreshToken }),

        // Clear user on logout
        clearUser: () => {
          localStorage.removeItem("staff-storage");
          set({ user: null, loggedIn: false, accessToken: null, refreshToken: null })
        },

        login: async (data, navigate) => {
          const toastId = toast.loading("Logging in..."); // Show loading toast
          const newdata = {
            identifier: data.identifier || data.email,
            password: data.password,
          };

          try {
            const response = await apiClient1.post(
              "profiles/auth/login/",
              newdata
            );
            // console.log("Response:", response);
            if (response.status === 200) {
              set({
                user: response.data.User,
                accessToken: response.data.access,
                refreshToken: response.data.refresh,
                loggedIn: true,
              });
              toast.success(response.data.message || "Login successful!"); // Replace loading toast with success
              setTimeout(() => {
                navigate("/dashboard");
              }, 3000);
              return response;
            }
          } catch (error) {
            const error2 =
              error?.response?.data?.error || error?.response?.data?.detail;
            // console.error("Error:", error);
            toast.error(error2 || "An error occurred");
            throw error;
          } finally {
            toast.dismiss(toastId);
          }
        },
        fetchUser: async () => {
          try {
            const response = await apiClient1.get("profiles/auth/login/");
            // console.log("Response:", response);
            if (response.status === 200) {
              set({ user: response?.data?.User, loggedIn: true, accessToken: response?.data?.access, refreshToken: response?.data?.refresh });
            }
          } catch (error) {
            console.error("Error:", error.response);
            toast.error(error.response?.data?.detail);
          }
        },

        logOut: async () => {
          try {
            const response = await apiClient1.post("profiles/auth/logout/");
            console.log(response);
            if (response.status === 200) {
              localStorage.removeItem("staff-storage");

              get().clearUser();
            }
          } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.detail);
          }
        },
      }),
      // { name: "user-storage" },
      {
        name: "user-storage",
        partialize: (state) => ({
          user: state.user,
          darkMode: state.darkMode,
          // loggedIn: state.loggedIn,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken
        }),
      }
    )
  )
);

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { toast } from 'sonner';

import { apiClient1 } from "../services/apiClient";

export const useUserStore = create(
  devtools(
    // persist(
    (set, get) => ({
      user: null,

      token: null,
      loggedIn: false,

      darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,

      // Get user info
      getUser: () => get().user,

      // Toggle Dark Mode
      toggleDarkMode: () => {
        toast.success("Dark mode toggled!", {
          duration: 500,
          position: "bottom-left",
        });
        set((state) => {
          const newMode = !state.darkMode;
          localStorage.setItem("darkMode", JSON.stringify(newMode));
          return { darkMode: newMode };
        });
      },

      // Set user after login/signup
      setUser: (user, token) => set({ user, token, loggedIn: true }),

      // Clear user on logout
      clearUser: () => set({ user: null, token: null, loggedIn: false }),
      login: async (data, navigate) => {
        const toastId = toast.loading("Logging in..."); // Show loading toast

        try {
          const response = await apiClient1.post("profiles/auth/login", data);
          // console.log("Response:", response);
          if (response.status === 200) {
            set({
              user: response.data.User,
              token: response.data.message||response.data.User.id,
              loggedIn: true,
            });
            toast.success(response.data.message || "Login successful!"); // Replace loading toast with success
            // setTimeout(() => {
            //   navigate("/dashboard");
            // }, 3000);
            return response;
          }
        } catch (error) {
          const error2 = error?.response?.data?.error || error?.response?.data?.detail
          // console.error("Error:", error);
          toast.error(error2 || "An error occurred");
          throw error;
        } finally {
          toast.dismiss(toastId);
        }
      },
      fetchUser: async () => {
        try {
          const response = await apiClient1.get("profiles/auth/login");
          // console.log("Response:", response);
          if (response.status === 200) {
            set({ user: response?.data?.User, loggedIn: true });
          }
        } catch (error) {
          console.error("Error:", error.response?.data);
          toast.error(error.response?.data?.detail);
        }
      },

      logOut: async () => {
        try {
          const response = await apiClient1.post("profiles/auth/logout");
          console.log(response);
          if (response.status === 200) {
            get().clearUser();
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error(error.response?.data?.detail);
        }
      },
    }),
    { name: "user-storage" },
    {
      // ...
    }
  )
  // )
);

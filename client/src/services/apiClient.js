// === axios.js ===
import axios from "axios";

import { useUserStore } from "../store/useUserStore";
// === Base URLs ===
const env = import.meta.env.VITE_ENV
const url = import.meta.env.VITE_BACKEND_URL;

let BASE_URL = "";
// if env === dev use ai else use ul
if (env === "development") { 
  BASE_URL = `/api/`;
} else {
  BASE_URL = url || `https://tiberbu.onrender.com/api/v1.0/`;
}

// console.log(env)

// === Factory Function for Creating Axios Instances ===
const createApiClient = (baseURL, contentType = "application/json") => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": contentType,
    },
    withCredentials: true,
  });

  // === Request Interceptor ===
  client.interceptors.request.use(
    (config) => {
      
      const { accessToken, refreshToken } = useUserStore.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Optionally include refresh token in a custom header
      // if (refreshToken) {
      //   config.headers["x-refresh-token"] = refreshToken;
      // }


      return config;
    },
    (error) => Promise.reject(error)
  );

  // === Response Interceptor ===
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const userStore = useUserStore.getState();
    // console.error("Error here",error)
    // Handle 403 Forbidden (token expired/invalid)
    // console.log(userStore);
    if (error.response?.status === 403) {
      userStore.clearUser();
      // window.location.href = "/login?session_expired=true";
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      userStore.clearUser();
      // window.location.href = "/login?unauthorized=true";
    }
    // Convert to standardized error format
    
    return Promise.reject(error);
  }
  );

  return client;
};

// === Axios Instances ===
export const apiClient1 = createApiClient(BASE_URL);
export const apiClient2 = createApiClient(
  BASE_URL,
  "multipart/form-data"
);

// === Usage Example ===
// apiClientV1.get('/user');
// apiClientV2.post('/login', { username, password });

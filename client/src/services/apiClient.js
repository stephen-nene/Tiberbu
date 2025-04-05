// === axios.js ===
import axios from "axios";

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
      return config;
    },
    (error) => Promise.reject(error)
  );

  // === Response Interceptor ===
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
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

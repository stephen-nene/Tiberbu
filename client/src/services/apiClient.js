// === axios.js ===
import axios from "axios";

// === Base URLs ===
const url = import.meta.env.VITE_BACKEND_URL;
// console.log(url)
const BASE_URL = url || `http://127.0.0.1:8000/api/v1.0/`;

// const BASE_URL = `/api/`;

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

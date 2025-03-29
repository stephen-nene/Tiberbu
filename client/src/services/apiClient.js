// === axios.js ===
import axios from "axios";

// === Base URLs ===

const BASE_URL =
  import.meta.env.VITE_API_URL || `http://127.0.0.1:8000/api/v1.0/`;

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

// src/plugins/axios-api.js
import axios from "axios";
import { PopupError } from "../composables/sweetalert";

const getAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 600000,
});

// Add request interceptor to automatically attach token if exists
getAPI.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken"); // get token from localStorage
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
getAPI.interceptors.response.use(
  (response) => response, // success just return
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized -> force logout
        localStorage.removeItem("authToken");
        window.location.href = "/login"; // redirect to login
      } else if (status === 500) {
        PopupError.fire({
          title: "Server Error",
          html: "Something went wrong on the server. Please try again later.",
        });
      } else {
        PopupError.fire({
          title: `Error ${status}`,
          html: error.response.data?.message || error.message,
        });
      }
    } else {
      // No response (e.g., network error)
      PopupError.fire({
        title: "Network Error",
        html: "Unable to connect to the server. Please check your connection.",
      });
    }

    return Promise.reject(error); // still reject so caller can catch if needed
  }
);

export { getAPI };

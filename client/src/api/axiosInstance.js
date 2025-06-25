import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

      if (accessToken && typeof accessToken === "string") {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      // If there's an error parsing the token, remove it from sessionStorage
      console.warn("Invalid token in sessionStorage, removing it");
      sessionStorage.removeItem("accessToken");
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token from sessionStorage
      sessionStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/refresh`,
            { refreshToken }
          );
          
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors with retry
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return axiosInstance(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

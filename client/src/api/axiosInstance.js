import axios from "axios";

// Get the API URL from environment or use a fallback
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  console.log("Environment VITE_API_URL:", envUrl);
  
  if (envUrl) {
    console.log("Using environment URL:", envUrl);
    return envUrl;
  }
  
  // Check if we're in production (onrender.com)
  if (window.location.hostname.includes('onrender.com')) {
    const productionUrl = 'https://mern-lms-213f.onrender.com';
    console.log("Using production URL:", productionUrl);
    return productionUrl;
  }
  
  // Local development
  const localUrl = "http://localhost:5000";
  console.log("Using local URL:", localUrl);
  return localUrl;
};

const apiUrl = getApiUrl();
console.log("Final API URL:", apiUrl);

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000, // 10 second timeout
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

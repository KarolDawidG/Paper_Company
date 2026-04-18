import axios from "axios";
import { refreshAccessToken } from "./authService";
import { base_URL } from "../components/utils/links";

const axiosInstance = axios.create({
  baseURL: base_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // 27.2.4: Interceptor przerywa przy błędach sieciowych i nie zapętla się na samym /auth/refresh.
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("auth/refresh")
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // 27.2.5: Odtwarzamy nagłówek tylko dla ponawianego requestu, bez globalnego nadpisywania axiosa.
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

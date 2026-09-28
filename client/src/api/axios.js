import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("token");
      if (!["/login", "/signup"].includes(window.location.pathname)) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.request) return "Cannot reach server. Try again.";
  return "Something went wrong.";
};

export default api;

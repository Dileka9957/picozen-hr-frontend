import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every outgoing request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: global response error handling (e.g. redirect on 401)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isAuthRequest =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");
    if (error.response?.status === 401 && !isAuthRequest) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/"; // adjust to your router path
    }
    return Promise.reject(error);
  },
);

// Reusable error extractor for all services
export function extractError(err: unknown): Error {
  if (err instanceof AxiosError) {
    const msg =
      err.response?.data?.message ?? err.response?.data?.error ?? err.message;
    return new Error(msg);
  }
  return new Error("An unexpected error occurred");
}

export default api;

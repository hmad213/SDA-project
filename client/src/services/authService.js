import api from "../api/axiosInstance";

export const login = (credentials) => api.post("/auth/login", credentials);
export const signup = (userData) => api.post("/auth/signup", userData);
export const refresh = (refreshToken) =>
  api.post("/auth/refresh", { refreshToken });

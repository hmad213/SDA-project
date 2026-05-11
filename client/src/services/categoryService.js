import api from "../api/axiosInstance";

export const getCategories = () => api.get("/brand");
export const getCategory = (id) => api.get(`/brand/${id}`);
export const createCategory = (data) => api.post("/brand", data);
export const updateCategory = (id, data) => api.put(`/brand/${id}`, data);
export const deleteCategory = (id) => api.delete(`/brand/${id}`);

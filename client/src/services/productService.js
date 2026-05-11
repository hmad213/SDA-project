import api from "../api/axiosInstance";

export const getProducts = (params) => api.get("/vehicle", { params });
export const getProduct = (id) => api.get(`/vehicle/${id}`);
export const searchProducts = (params) =>
  api.get("/vehicle/search", { params });
export const createProduct = (data) => api.post("/vehicle", data);
export const updateProduct = (id, data) => api.put(`/vehicle/${id}`, data);
export const deleteProduct = (id) => api.delete(`/vehicle/${id}`);
export const getProductsByRetailer = (id) => api.get(`/vehicle/retailer/${id}`);

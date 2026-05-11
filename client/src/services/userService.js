import api from "../api/axiosInstance";

export const getUsers = () => api.get("/user");
export const getUser = (id) => api.get(`/user/${id}`);
export const updateUser = (id, data) => api.put(`/user/${id}`, data);
export const deleteUser = (id) => api.delete(`/user/${id}`);
export const getAdmins = () => api.get("/user/admin");
export const getCustomers = () => api.get("/user/customer");
export const getRetailers = () => api.get("/user/retailer");
export const createUser = (data) => api.post("/user", data);

import api from "../api/axiosInstance";

export const getAllOrders = () => api.get("/order");

export const getOrderByIndex = (id) => api.get(`/order/${id}`);

export const getOrdersByCustomer = (id) => api.get(`/order/customer/${id}`);

export const getOrdersByRetailer = (id) => api.get(`/order/retailer/${id}`);

export const getOrdersByProduct = (id) => api.get(`/order/product/${id}`);

export const postOrder = (cart) => api.post("/order", { cart });

export const updateOrder = (id, data) => api.put(`/order/${id}`, data);

export const deleteOrder = (id) => api.delete(`/order/${id}`);

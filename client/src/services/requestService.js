import api from "../api/axiosInstance";

export const getPendingRequests = () => api.get("/request/pending");
export const submitRequest = () => api.post("/request");
export const updateRequestStatus = (id, status) =>
  api.put(`/request/${id}`, { status });
export const getMyRequest = () => api.get("/request/me");

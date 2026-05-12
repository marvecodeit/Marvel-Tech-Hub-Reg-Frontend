import api from "./api";

export const jobService = {
  getAll: () => api.get("/jobs").then((r) => r.data),
  getById: (id) => api.get(`/jobs/${id}`).then((r) => r.data),
  create: (data) => api.post("/jobs", data).then((r) => r.data),
  delete: (id) => api.delete(`/jobs/${id}`).then((r) => r.data),
};

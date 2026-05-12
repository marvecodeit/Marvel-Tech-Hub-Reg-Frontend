import api from "./api";

export const applicationService = {
  submit: (formData) =>
    api.post("/applications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data),

  getMine: () => api.get("/applications/me").then((r) => r.data),

  getAll: () => api.get("/applications").then((r) => r.data),

  updateStatus: (id, status) =>
    api.put(`/applications/${id}`, { status }).then((r) => r.data),
};

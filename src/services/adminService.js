import api from "./api";

export const adminService = {
  getUsers: () => api.get("/admin/users").then((r) => r.data),
};

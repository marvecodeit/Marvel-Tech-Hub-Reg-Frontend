import api from "./api";

export const authService = {
  login: (creds) => api.post("/auth/login", creds).then((r) => r.data),
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
};

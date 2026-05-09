import { apiFetch } from "@/utils/api";

export const profileService = {
  getProfile: async () => {
    return apiFetch<any>("/users/profile", "get");
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiFetch<any>("/users/avatar", "patch", formData);
  },

  updateProfile: async (data: { username?: string }) => {
    return apiFetch<any>("/users/profile", "patch", data);
  },

  changePassword: async (data: any) => {
    return apiFetch<any>("/users/password", "patch", data);
  },

  changeEmail: async (data: any) => {
    return apiFetch<any>("/users/email", "patch", data);
  },
};

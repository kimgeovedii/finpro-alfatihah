import { apiFetch } from "@/utils/api";

export const addressService = {
  getAddresses: async () => {
    return apiFetch<any[]>("/addresses", "get");
  },

  createAddress: async (data: any) => {
    return apiFetch<any>("/addresses", "post", data);
  },

  updateAddress: async (id: string, data: any) => {
    return apiFetch<any>(`/addresses/${id}`, "patch", data);
  },

  deleteAddress: async (id: string) => {
    return apiFetch<any>(`/addresses/${id}`, "delete");
  },

  setPrimaryAddress: async (id: string) => {
    return apiFetch<any>(`/addresses/${id}/primary`, "patch");
  },
};

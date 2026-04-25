import axios from "axios";
import { apiFetch } from "@/utils/api";


export interface Region {
  code: string;
  name: string;
}

export const regionService = {
  getProvinces: async () => {
    return apiFetch<Region[]>("/addresses/regions/provinces", "get");
  },
  getRegencies: async (provinceCode: string) => {
    return apiFetch<Region[]>(`/addresses/regions/regencies/${provinceCode}`, "get");
  },
  getDistricts: async (regencyCode: string) => {
    return apiFetch<Region[]>(`/addresses/regions/districts/${regencyCode}`, "get");
  },
  getVillages: async (districtCode: string) => {
    return apiFetch<Region[]>(`/addresses/regions/villages/${districtCode}`, "get");
  },
  searchAddress: async (query: string) => {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
        countrycodes: "id",
        limit: 5,
      },
      headers: {
        "User-Agent": "Online-Grocery-App/1.0",
      }
    });
    return res.data;
  },
};


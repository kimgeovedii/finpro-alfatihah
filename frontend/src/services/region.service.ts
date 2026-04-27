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
    return apiFetch<any[]>(`/addresses/geocoding/search?q=${encodeURIComponent(query)}`, "get");
  },
  reverseGeocode: async (lat: number, lng: number) => {
    return apiFetch<any>(`/addresses/geocoding/reverse?lat=${lat}&lon=${lng}`, "get");
  }
};


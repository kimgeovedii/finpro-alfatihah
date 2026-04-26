import { create } from "zustand";
import { BranchData, ProductCard, PaginationMeta } from "@/features/home/types/home.types";
import { HomeRepository } from "@/features/home/repository/home.repository";
import { regionService } from "@/services/region.service";

interface HomeState {
  userCoords: { lat: number; lng: number } | null;
  searchCoords: { lat: number; lng: number } | null;
  locationStatus: "idle" | "requesting" | "granted" | "denied";
  nearestBranch: BranchData | null;
  distance: number | null;
  isInRange: boolean;
  products: ProductCard[];
  productsMeta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  locationName: string | null;

  setLocationStatus: (status: "idle" | "requesting" | "granted" | "denied") => void;
  setUserCoords: (coords: { lat: number; lng: number } | null) => Promise<void>;
  setSearchCoords: (coords: { lat: number; lng: number } | null) => Promise<void>;
  fetchNearestBranch: (lat?: number, lng?: number, page?: number) => Promise<void>;
}

const repository = new HomeRepository();

export const useHomeStore = create<HomeState>((set, get) => ({
  userCoords: null,
  searchCoords: null,
  locationStatus: "idle",
  nearestBranch: null,
  distance: null,
  isInRange: false,
  products: [],
  productsMeta: null,
  isLoading: false,
  error: null,
  locationName: null,

  setLocationStatus: (status) => set({ locationStatus: status }),
  setUserCoords: async (coords) => {
    set({ userCoords: coords });
    if (coords && !get().searchCoords) {
      // Fetch location name for GPS if no search is active
      try {
        const data = await regionService.reverseGeocode(coords.lat, coords.lng);
        const city = data.address.city || data.address.town || data.address.village || data.address.city_district || data.address.county || "";
        const province = data.address.state || "";
        if (city && province) set({ locationName: `${city}, ${province}` });
      } catch (error) { console.error(error); }
    }
  },

  setSearchCoords: async (coords) => {
    set({ searchCoords: coords });
    if (coords) {
      try {
        const data = await regionService.reverseGeocode(coords.lat, coords.lng);
        const city = data.address.city || data.address.town || data.address.village || data.address.city_district || data.address.county || "";
        const province = data.address.state || "";
        if (city && province) set({ locationName: `${city}, ${province}` });
      } catch (error) { console.error(error); }
    }
  },

  fetchNearestBranch: async (lat, lng, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await repository.getNearestBranch({ lat, lng, page });
      
      set((state) => ({
        nearestBranch: response.branch,
        distance: response.distance,
        isInRange: response.isInRange,
        products: page === 1 ? response.products.data : [...state.products, ...response.products.data],
        productsMeta: response.products.meta,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch nearest branch", isLoading: false });
    }
  },
}));

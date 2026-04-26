import { create } from "zustand";
import { BranchData, ProductCard, PaginationMeta } from "@/features/home/types/home.types";
import { HomeRepository } from "@/features/home/repository/home.repository";
import { regionService } from "@/services/region.service";
import { locationSchema } from "@/features/home/validations/home.schema";

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
  isProductsLoadingMore: boolean;
  error: string | null;
  locationName: string | null;
  allBranches: BranchData[];
  allBranchesMeta: PaginationMeta | null;

  setLocationStatus: (status: "idle" | "requesting" | "granted" | "denied") => void;
  setUserCoords: (coords: { lat: number; lng: number } | null) => Promise<void>;
  setSearchCoords: (coords: { lat: number; lng: number } | null) => Promise<void>;
  fetchNearestBranch: (lat?: number, lng?: number, page?: number) => Promise<void>;
  fetchAllBranches: (page?: number) => Promise<void>;
  requestLocation: () => Promise<void>;
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
  isProductsLoadingMore: false,
  error: null,
  locationName: null,
  allBranches: [],
  allBranchesMeta: null,

  setLocationStatus: (status) => set({ locationStatus: status }),
  setUserCoords: async (coords) => {
    set({ userCoords: coords });
    if (coords && !get().searchCoords) {
      try {
        const data = await regionService.reverseGeocode(coords.lat, coords.lng);
        const city = data.address.city || data.address.town || data.address.village || data.address.city_district || data.address.county || "";
        const province = data.address.state || "";
        if (city && province) set({ locationName: city && province ? `${city}, ${province}` : city || province });
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
        if (city && province) set({ locationName: city && province ? `${city}, ${province}` : city || province });
      } catch (error) { console.error(error); }
    }
  },

  fetchNearestBranch: async (lat, lng, page = 1) => {
    if (page === 1) set({ isLoading: true, error: null });
    else set({ isProductsLoadingMore: true });

    try {
      const response = await repository.getNearestBranch({ lat, lng, page });
      
      set((state) => ({
        nearestBranch: response.branch,
        distance: response.distance,
        isInRange: response.isInRange,
        products: page === 1 ? response.products.data : [...state.products, ...response.products.data],
        productsMeta: response.products.meta,
        isLoading: false,
        isProductsLoadingMore: false,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch nearest branch", isLoading: false, isProductsLoadingMore: false });
    }
  },

  fetchAllBranches: async (page = 1) => {
    try {
      const response = await repository.getAllBranches({ page });
      set((state) => ({
        allBranches: page === 1 ? response.data : [...state.allBranches, ...response.data],
        allBranchesMeta: response.meta,
      }));
    } catch (error) {
      console.error("Failed to fetch all branches:", error);
    }
  },

  requestLocation: async () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      set({ locationStatus: "denied" });
      get().fetchNearestBranch();
      return;
    }

    set({ locationStatus: "requesting" });
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        try {
          await locationSchema.validate(coords);
          await get().setUserCoords(coords);
          set({ locationStatus: "granted" });
          get().fetchNearestBranch(coords.lat, coords.lng);
        } catch (err) {
          console.error("Coords validation failed:", err);
          set({ locationStatus: "denied" });
          get().fetchNearestBranch();
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        set({ locationStatus: "denied" });
        get().fetchNearestBranch(); 
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  },
}));

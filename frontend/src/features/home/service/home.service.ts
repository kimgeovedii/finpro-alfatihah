import { create } from "zustand";
import { BranchData, ProductCard, PaginationMeta } from "@/features/home/types/home.types";
import { HomeRepository } from "@/features/home/repository/home.repository";

interface HomeState {
  userCoords: { lat: number; lng: number } | null;
  locationStatus: "idle" | "requesting" | "granted" | "denied";
  nearestBranch: BranchData | null;
  distance: number | null;
  isInRange: boolean;
  products: ProductCard[];
  productsMeta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;

  setLocationStatus: (status: "idle" | "requesting" | "granted" | "denied") => void;
  setUserCoords: (coords: { lat: number; lng: number } | null) => void;
  fetchNearestBranch: (lat?: number, lng?: number, page?: number) => Promise<void>;
}

const repository = new HomeRepository();

export const useHomeStore = create<HomeState>((set, get) => ({
  userCoords: null,
  locationStatus: "idle",
  nearestBranch: null,
  distance: null,
  isInRange: false,
  products: [],
  productsMeta: null,
  isLoading: false,
  error: null,

  setLocationStatus: (status) => set({ locationStatus: status }),
  setUserCoords: (coords) => set({ userCoords: coords }),

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

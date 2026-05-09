import { create } from "zustand";
import { BranchData, ProductCard, PaginationMeta, UserAddress } from "@/features/home/types/home.types";
import { HomeRepository } from "@/features/home/repository/home.repository";
import { regionService } from "@/services/region.service";
import { locationSchema } from "@/features/home/validations/home.schema";

interface HomeState {
  userCoords: { lat: number; lng: number } | null;
  searchCoords: { lat: number; lng: number } | null;
  productLocationCoords: { lat: number; lng: number } | null;
  selectedLocationType: "current" | "address";
  selectedAddressId: string | null;
  addresses: UserAddress[];
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
  setAddresses: (addresses: UserAddress[]) => void;
  selectAddress: (addressId: string) => Promise<void>;
  selectCurrentLocation: () => Promise<void>;
}

const repository = new HomeRepository();

export const useHomeStore = create<HomeState>((set, get) => ({
  userCoords: null,
  searchCoords: null,
  productLocationCoords: null,
  selectedLocationType: "current",
  selectedAddressId: null,
  addresses: [],
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

  setAddresses: (addresses) => {
    set({ addresses });
    // If we have a primary address and no location is set, default to it
    const primary = addresses.find(a => a.isPrimary);
    if (primary && get().selectedLocationType === "address" && !get().selectedAddressId) {
      get().selectAddress(primary.id);
    }
  },

  selectAddress: async (addressId) => {
    const address = get().addresses.find(a => a.id === addressId);
    if (address) {
      const coords = { 
        lat: typeof address.latitude === "string" ? parseFloat(address.latitude) : address.latitude, 
        lng: typeof address.longitude === "string" ? parseFloat(address.longitude) : address.longitude 
      };
      set({ 
        selectedLocationType: "address", 
        selectedAddressId: addressId,
        productLocationCoords: coords,
        locationName: address.address.length > 25 ? address.address.substring(0, 25) + "..." : address.address
      });
      get().fetchNearestBranch(coords.lat, coords.lng);
    }
  },

  selectCurrentLocation: async () => {
    set({ selectedLocationType: "current", selectedAddressId: null, productLocationCoords: null });
    const coords = get().userCoords;
    if (coords) {
      get().fetchNearestBranch(coords.lat, coords.lng);
      try {
        const data = await regionService.reverseGeocode(coords.lat, coords.lng);
        const city = data.address.city || data.address.town || data.address.village || "";
        const province = data.address.state || "";
        set({ locationName: city && province ? `${city}, ${province}` : city || province || "Lokasi Saat Ini" });
      } catch (e) { set({ locationName: "Lokasi Saat Ini" }); }
    } else {
      get().requestLocation();
    }
  },

  setLocationStatus: (status) => set({ locationStatus: status }),
  setUserCoords: async (coords) => {
    set({ userCoords: coords });
    if (coords && !get().productLocationCoords && get().selectedLocationType === "current") {
      try {
        const data = await regionService.reverseGeocode(coords.lat, coords.lng);
        const city = data.address.city || data.address.town || data.address.village || "";
        const province = data.address.state || "";
        set({ locationName: city && province ? `${city}, ${province}` : city || province || "Lokasi Saat Ini" });
      } catch (error) { console.error(error); }
    }
  },

  setSearchCoords: async (coords) => {
    set({ searchCoords: coords });
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
          if (get().selectedLocationType === "current") {
            get().fetchNearestBranch(coords.lat, coords.lng);
          }
        } catch (err) {
          set({ locationStatus: "denied" });
          get().fetchNearestBranch();
        }
      },
      (error) => {
        set({ locationStatus: "denied" });
        get().fetchNearestBranch(); 
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  },
}));

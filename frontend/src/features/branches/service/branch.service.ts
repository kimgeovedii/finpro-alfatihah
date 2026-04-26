import { create } from "zustand";
import { NearestBranchResponse } from "@/features/home/types/home.types";
import { BranchRepository } from "../repository/branch.repository";

interface BranchState {
  detail: NearestBranchResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchBranchDetail: (id: string, page?: number) => Promise<void>;
  reset: () => void;
}

const repository = new BranchRepository();

export const useBranchStore = create<BranchState>((set) => ({
  detail: null,
  isLoading: false,
  error: null,

  fetchBranchDetail: async (id, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await repository.getBranchDetail(id, page);
      set({ detail: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Gagal memuat detail toko", isLoading: false });
    }
  },

  reset: () => set({ detail: null, isLoading: false, error: null }),
}));

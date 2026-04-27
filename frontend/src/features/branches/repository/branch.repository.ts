import { apiFetch } from "@/utils/api";
import { NearestBranchResponse } from "@/features/home/types/home.types";

export class BranchRepository {
  async getBranchDetail(id: string, page: number = 1, limit: number = 12) {
    return apiFetch<NearestBranchResponse>(`/branches/${id}?page=${page}&limit=${limit}`);
  }
}

import { apiFetch } from "@/utils/api";
import { NearestBranchResponse, BranchData, PaginationMeta } from "@/features/home/types/home.types";

export class HomeRepository {
  async getNearestBranch(params: {
    lat?: number;
    lng?: number;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params.lat != null) query.set("lat", String(params.lat));
    if (params.lng != null) query.set("lng", String(params.lng));
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 8));
    return apiFetch<NearestBranchResponse>(`/branches/nearest?${query.toString()}`);
  }

  async getAllBranches(params: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 50)); // Map can handle more
    return apiFetch<{ data: BranchData[]; meta: PaginationMeta }>(`/branches?${query.toString()}`);
  }
  async getBranchDetail(slug: string, page: number = 1, limit: number = 12) {
    return apiFetch<NearestBranchResponse>(`/branches/${slug}?page=${page}&limit=${limit}`);
  }
}

import { apiFetch } from "@/utils/api";
import { 
  ManageStockListResponse, 
  StockJournalListResponse, 
  UpdateStockPayload, 
  Branch, 
  BranchInventory 
} from "../types/manageStock.type";

export class BranchInventoryRepository {
  async getBranchInventories(params: {
    page?: number;
    limit?: number;
    branchId?: string;
    productName?: string;
  }): Promise<ManageStockListResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.branchId && params.branchId !== "all") searchParams.append("branchId", params.branchId);
    if (params.productName) searchParams.append("productName", params.productName);

    return apiFetch<ManageStockListResponse>(`/branch-inventories?${searchParams.toString()}`);
  }

  async getBranches(): Promise<Branch[]> {
    // Assuming there's a /branches endpoint or we can fetch them from accounts/context
    // For now, let's try to hit /branches. If it doesn't exist, we'll need to implement it in backend.
    try {
      const response = await apiFetch<{ data: Branch[] }>("/branches");
      return response.data || (response as any);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      return [];
    }
  }

  async updateStock(id: string, payload: UpdateStockPayload): Promise<BranchInventory> {
    return apiFetch<BranchInventory>(`/branch-inventories/${id}`, "patch", payload);
  }

  async getStockJournals(params: {
    page?: number;
    limit?: number;
    branchInventoryId?: string;
    productId?: string;
  }): Promise<StockJournalListResponse> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.branchInventoryId) searchParams.append("branchInventoryId", params.branchInventoryId);
    if (params.productId) searchParams.append("productId", params.productId);

    return apiFetch<StockJournalListResponse>(`/stock-journals?${searchParams.toString()}`);
  }
}

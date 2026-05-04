import { apiFetch } from "@/utils/api";
import {
  IDiscount,
  ICreateDiscountRequest,
  IUpdateDiscountRequest,
} from "../types/discount.type";

interface GetDiscountsResponse {
  data: IDiscount[];
  meta?: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export class DiscountRepository {
  async getDiscounts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    branchId?: string;
    sortBy?: string;
    sortOrder?: string;
    discountType?: string;
    status?: string;
  }): Promise<GetDiscountsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.branchId) searchParams.append("branchId", params.branchId);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params?.discountType) searchParams.append("discountType", params.discountType);
    if (params?.status) searchParams.append("status", params.status);

    return apiFetch<GetDiscountsResponse>(`/discounts?${searchParams.toString()}`);
  }

  async getDiscount(id: string): Promise<IDiscount> {
    const response = await apiFetch<{ data: IDiscount }>(`/discounts/${id}`);
    return response.data;
  }

  async createDiscount(payload: ICreateDiscountRequest): Promise<IDiscount> {
    const response = await apiFetch<{ data: IDiscount }>("/discounts", "post", payload);
    return response.data;
  }

  async updateDiscount(id: string, payload: IUpdateDiscountRequest): Promise<IDiscount> {
    const response = await apiFetch<{ data: IDiscount }>(`/discounts/${id}`, "put", payload);
    return response.data;
  }

  async deleteDiscount(id: string): Promise<void> {
    await apiFetch(`/discounts/${id}`, "delete");
  }

  // Not strictly needed if managed in a different way, but handy
  async assignProducts(discountId: string, productIds: string[]): Promise<void> {
    await apiFetch(`/discounts/${discountId}/products`, "post", { productIds });
  }

  async removeProduct(discountId: string, productId: string): Promise<void> {
    await apiFetch(`/discounts/${discountId}/products/${productId}`, "delete");
  }
}

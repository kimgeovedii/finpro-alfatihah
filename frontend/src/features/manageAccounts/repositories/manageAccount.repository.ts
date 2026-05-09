import { apiFetch } from "@/utils/api";
import {
  ManageAccountListResponse,
  CreateAccountPayload,
  UpdateAccountPayload,
  ManageAccount,
  Branch,
} from "@/features/manageAccounts/types/manageAccount.type";

export class ManageAccountRepository {
  public getAllAccounts = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
  ): Promise<ManageAccountListResponse> => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (role) params.set("role", role);

    return await apiFetch<ManageAccountListResponse>(
      `/users?${params.toString()}`,
      "get",
    );
  };

  public createAccount = async (
    payload: CreateAccountPayload,
  ): Promise<ManageAccount> => {
    return await apiFetch<ManageAccount>("/users", "post", payload);
  };

  public updateAccount = async (
    id: string,
    payload: UpdateAccountPayload,
  ): Promise<ManageAccount> => {
    return await apiFetch<ManageAccount>(`/users/${id}`, "put", payload);
  };

  public deleteAccount = async (id: string): Promise<void> => {
    await apiFetch<void>(`/users/${id}`, "delete");
  };

  public getAllBranches = async (): Promise<Branch[]> => {
    const response = await apiFetch<{ data: Branch[]; meta: unknown }>(
      "/branches",
      "get",
    );
    return response?.data ?? [];
  };
}

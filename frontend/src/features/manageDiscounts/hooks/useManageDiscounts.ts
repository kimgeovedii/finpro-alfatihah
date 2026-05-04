import { useCallback, useEffect, useRef, useState } from "react";
import { IDiscount, ICreateDiscountRequest, IUpdateDiscountRequest } from "../types/discount.type";
import { DiscountRepository } from "../repositories/discount.repository";
import toast from "react-hot-toast";

import { useAuthService } from "@/features/auth/hooks/useAuthService";

const repo = new DiscountRepository();

export const useManageDiscounts = () => {
  const { user, fetchUser, isLoading: userLoading } = useAuthService();
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<IDiscount | null>(null);
  const [discountToDelete, setDiscountToDelete] = useState<IDiscount | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      fetchUser();
    }
  }, [fetchUser, userLoading, user]);

  const canManage =
    (user as any)?.employee?.role === "STORE_ADMIN" ||
    (user as any)?.employee?.role === "SUPER_ADMIN" ||
    (user as any)?.role === "SUPER_ADMIN";
  
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }, [sortBy, sortOrder]);

  const fetchDiscounts = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const searchParams: any = {
        page,
        limit: meta.limit,
        sortBy,
        sortOrder,
      };
      
      if (debouncedSearch) {
        searchParams.search = debouncedSearch;
      }

      if (activeTab !== "All") {
        const typeMap: Record<string, string> = {
          "Direct Discounts": "PRODUCT_DISCOUNT",
          "Min Purchase": "MINIMUM_PURCHASE",
          "B1G1": "BUY_ONE_GET_ONE_FREE",
        };
        searchParams.discountType = typeMap[activeTab];
      }

      if (statusFilter !== "All Status") {
        searchParams.status = statusFilter.toUpperCase();
      }

      const response = await repo.getDiscounts(searchParams);

      if (response && response.data) {
        setDiscounts(response.data);
        if (response.meta) {
          setMeta(response.meta as any);
        }
      } else {
        setDiscounts([]);
      }
    } catch (err) {
      toast.error((err as Error).message || "Failed to load discounts");
      setDiscounts([]);
    } finally {
      setIsLoading(false);
    }
  }, [meta.limit, debouncedSearch, activeTab, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchDiscounts(1);
  }, [debouncedSearch, activeTab, statusFilter, sortBy, sortOrder, fetchDiscounts]);

  const handlePageChange = useCallback((page: number) => {
    fetchDiscounts(page);
  }, [fetchDiscounts]);

  const handleCreateSubmit = async (values: ICreateDiscountRequest) => {
    try {
      setIsSubmitting(true);
      await repo.createDiscount(values);
      toast.success("Discount created successfully!");
      setCreateDialogOpen(false);
      fetchDiscounts(meta.page);
    } catch (err) {
      toast.error((err as Error).message || "Failed to create discount");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (id: string, values: IUpdateDiscountRequest) => {
    try {
      setIsSubmitting(true);
      await repo.updateDiscount(id, values);
      toast.success("Discount updated successfully!");
      setSelectedDiscount(null);
      fetchDiscounts(meta.page);
    } catch (err) {
      toast.error((err as Error).message || "Failed to update discount");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (discount: IDiscount) => {
    setDiscountToDelete(discount);
  };

  const confirmDelete = async () => {
    if (!discountToDelete) return;
    try {
      setIsLoading(true);
      await repo.deleteDiscount(discountToDelete.id);
      toast.success("Discount deleted successfully");
      setDiscountToDelete(null);
      fetchDiscounts(meta.page);
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete discount");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    discounts,
    isLoading,
    isSubmitting,
    meta,
    createDialogOpen,
    selectedDiscount,
    searchQuery,
    discountToDelete,
    activeTab,
    statusFilter,
    sortBy,
    sortOrder,
    
    handleSearchChange,
    setActiveTab,
    setStatusFilter,
    handleSort,
    setCreateDialogOpen,
    setSelectedDiscount,
    setDiscountToDelete,
    handlePageChange,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleDelete,
    confirmDelete,
    fetchDiscounts,
    canManage,
    user,
    userLoading,
  };
};

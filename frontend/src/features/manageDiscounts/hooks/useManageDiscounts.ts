import { useCallback, useEffect, useRef, useState } from "react";
import { IDiscount, ICreateDiscountRequest, IUpdateDiscountRequest } from "../types/discount.type";
import { DiscountRepository } from "../repositories/discount.repository";
import toast from "react-hot-toast";

const repo = new DiscountRepository();

export const useManageDiscounts = () => {
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<IDiscount | null>(null);
  const [discountToDelete, setDiscountToDelete] = useState<IDiscount | null>(null);
  
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  const fetchDiscounts = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const searchParams: any = {
        page,
        limit: meta.limit,
      };
      if (debouncedSearch) {
        searchParams.search = debouncedSearch;
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
  }, [meta.limit, debouncedSearch]);

  useEffect(() => {
    fetchDiscounts(1);
  }, [debouncedSearch, fetchDiscounts]);

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
    
    handleSearchChange,
    setCreateDialogOpen,
    setSelectedDiscount,
    setDiscountToDelete,
    handlePageChange,
    handleCreateSubmit,
    handleUpdateSubmit,
    handleDelete,
    confirmDelete,
    fetchDiscounts,
  };
};

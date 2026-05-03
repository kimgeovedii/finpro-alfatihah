import { useCallback, useEffect, useRef, useState } from "react";
import {
  BranchInventory,
  StockJournal,
  Branch,
  PaginationMeta,
  UpdateStockPayload,
  ManageProduct,
} from "../types/manageStock.type";
import { BranchInventoryRepository } from "../repositories/branchInventory.repository";
import { ManageProductRepository } from "@/features/manageProducts/repositories/manageProduct.repository";
import { useUser } from "@/features/auth/hooks/useUser";
import { UserWithEmployee } from "../types/manageStock.type";
import toast from "react-hot-toast";

const repo = new BranchInventoryRepository();
const productRepo = new ManageProductRepository();

export const useManageStock = () => {
  const { user: baseUser } = useUser();
  const user = baseUser as UserWithEmployee | null;
  const isStoreAdmin = user?.employee?.role === "STORE_ADMIN";
  const userBranchId = user?.employee?.branchId;

  const [inventory, setInventory] = useState<BranchInventory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [allProducts, setAllProducts] = useState<ManageProduct[]>([]);
  const [journals, setJournals] = useState<StockJournal[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isJournalLoading, setIsJournalLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Effect to lock branch for STORE_ADMIN
  useEffect(() => {
    if (isStoreAdmin && userBranchId) {
      setSelectedBranchId(userBranchId);
    }
  }, [isStoreAdmin, userBranchId]);

  const [updateStockOpen, setUpdateStockOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BranchInventory | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  const fetchInventory = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const response = await repo.getBranchInventories({
          page,
          limit: meta.limit,
          branchId: selectedBranchId,
          stockStatus: selectedStockStatus,
          productName: debouncedSearch || undefined,
          sortBy,
          sortOrder,
        });

        if (response && response.data) {
          setInventory(response.data);
          setMeta(response.meta);
        } else {
          setInventory([]);
        }
      } catch (err) {
        toast.error((err as Error).message || "Failed to load inventory");
        setInventory([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      meta.limit,
      debouncedSearch,
      selectedBranchId,
      selectedStockStatus,
      sortBy,
      sortOrder,
    ],
  );

  const fetchBranches = useCallback(async () => {
    try {
      const data = await repo.getBranches();
      setBranches(data || []);
    } catch (err) {
      console.error("Failed to load branches", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await productRepo.getAllProducts(1, 100);
      setAllProducts(response.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  }, []);

  useEffect(() => {
    fetchInventory(1);
  }, [
    debouncedSearch,
    selectedBranchId,
    selectedStockStatus,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchBranches();
    fetchProducts();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchInventory(page);
    },
    [fetchInventory],
  );

  const handleSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(column);
        setSortOrder("desc");
      }
    },
    [sortBy, sortOrder],
  );

  const handleUpdateClick = (item: BranchInventory) => {
    setSelectedItem(item);
    setUpdateStockOpen(true);
  };

  const handleViewJournal = async (item: BranchInventory) => {
    setSelectedItem(item);
    setJournalOpen(true);
    setIsJournalLoading(true);
    try {
      const resp = await repo.getStockJournals({ branchInventoryId: item.id });
      setJournals(resp.data || []);
    } catch (err) {
      toast.error("Failed to load stock history");
    } finally {
      setIsJournalLoading(false);
    }
  };

  const handleUpdateSubmit = async (
    values: UpdateStockPayload & { productId?: string; branchId?: string },
  ) => {
    try {
      setIsSubmitting(true);
      if (selectedItem) {
        await repo.updateStock(selectedItem.id, values);
      } else if (values.productId && values.branchId) {
        const existing = inventory.find(
          (i) =>
            i.productId === values.productId && i.branchId === values.branchId,
        );
        if (existing) {
          await repo.updateStock(existing.id, values);
        } else {
          await repo.createBranchInventory({
            productId: values.productId,
            branchId: values.branchId,
            currentStock: values.actualStock,
            notes: values.notes,
          });
        }
      }
      toast.success("Stock updated successfully!");
      setUpdateStockOpen(false);
      fetchInventory(meta.page);
    } catch (err) {
      toast.error((err as Error).message || "Update failed");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    isStoreAdmin,
    inventory,
    branches,
    journals,
    meta,
    isLoading,
    isJournalLoading,
    searchQuery,
    selectedBranchId,
    allProducts,
    updateStockOpen,
    journalOpen,
    selectedItem,
    isSubmitting,

    handleSearchChange,
    setSelectedBranchId,
    selectedStockStatus,
    setSelectedStockStatus,
    handlePageChange,
    handleSort,
    handleUpdateClick,
    handleViewJournal,
    handleUpdateSubmit,
    sortBy,
    sortOrder,
    setUpdateStockOpen,
    setJournalOpen,
    setSelectedItem,
    fetchInventory,
  };
};

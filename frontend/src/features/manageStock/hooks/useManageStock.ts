import { useCallback, useEffect, useRef, useState } from "react";
import {
  BranchInventory,
  StockJournal,
  Branch,
  PaginationMeta,
  SimulationRole,
  UpdateStockPayload,
} from "../types/manageStock.type";
import { BranchInventoryRepository } from "../repositories/branchInventory.repository";
import toast from "react-hot-toast";

const repo = new BranchInventoryRepository();

export const useManageStock = () => {
  const [inventory, setInventory] = useState<BranchInventory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
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
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [simulationRole, setSimulationRole] = useState<SimulationRole>(SimulationRole.SUPER_ADMIN);
  
  const [updateStockOpen, setUpdateStockOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BranchInventory | null>(null);
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
          productName: debouncedSearch || undefined,
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
    [meta.limit, debouncedSearch, selectedBranchId],
  );

  const fetchBranches = useCallback(async () => {
    try {
      const data = await repo.getBranches();
      setBranches(data || []);
    } catch (err) {
      console.error("Failed to load branches", err);
    }
  }, []);

  useEffect(() => {
    fetchInventory(1);
  }, [debouncedSearch, selectedBranchId]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchInventory(page);
    },
    [fetchInventory],
  );

  const handleRoleToggle = (role: SimulationRole) => {
    setSimulationRole(role);
    if (role === SimulationRole.STORE_ADMIN) {
      // For simulation, pick the first branch if in store admin mode
      if (branches.length > 0) setSelectedBranchId(branches[0].id);
    } else {
      setSelectedBranchId("all");
    }
  };

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

  const handleUpdateSubmit = async (values: UpdateStockPayload) => {
    if (!selectedItem) return;
    try {
      setIsSubmitting(true);
      await repo.updateStock(selectedItem.id, values);
      toast.success("Stock updated and journal created!");
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
    inventory,
    branches,
    journals,
    meta,
    isLoading,
    isJournalLoading,
    searchQuery,
    selectedBranchId,
    simulationRole,
    updateStockOpen,
    journalOpen,
    selectedItem,
    isSubmitting,
    
    handleSearchChange,
    setSelectedBranchId,
    handleRoleToggle,
    handlePageChange,
    handleUpdateClick,
    handleViewJournal,
    handleUpdateSubmit,
    setUpdateStockOpen,
    setJournalOpen,
    fetchInventory,
  };
};

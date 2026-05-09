import { useCallback, useEffect, useRef, useState } from "react";
import {
  ManageAccount,
  PaginationMeta,
  CreateAccountPayload,
  UpdateAccountPayload,
  Branch,
  RoleFilter,
} from "@/features/manageAccounts/types/manageAccount.type";
import { ManageAccountRepository } from "@/features/manageAccounts/repositories/manageAccount.repository";
import toast from "react-hot-toast";

const repo = new ManageAccountRepository();

export const useManageAccount = () => {
  const [accounts, setAccounts] = useState<ManageAccount[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ManageAccount | null>(
    null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  const fetchAccounts = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const response = await repo.getAllAccounts(
          page,
          meta.limit,
          debouncedSearch || undefined,
          roleFilter === "ALL" ? undefined : roleFilter,
        );

        if (response && "data" in response) {
          setAccounts(response.data);
          setMeta(response.meta);
        } else {
          setAccounts([]);
        }
      } catch (err) {
        toast.error((err as Error).message || "Failed to load accounts");
        setAccounts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [meta.limit, debouncedSearch, roleFilter],
  );

  const fetchBranches = useCallback(async () => {
    try {
      const data = await repo.getAllBranches();
      setBranches(data);
    } catch (err) {
      console.error("Failed to load branches:", err);
    }
  }, []);

  useEffect(() => {
    fetchAccounts(1);
    fetchBranches();
  }, [debouncedSearch, roleFilter, fetchAccounts, fetchBranches]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchAccounts(page);
    },
    [fetchAccounts],
  );

  const handleAddClick = useCallback(() => {
    setSelectedAccount(null);
    setDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((account: ManageAccount) => {
    setSelectedAccount(account);
    setDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((account: ManageAccount) => {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (values: CreateAccountPayload | UpdateAccountPayload) => {
      try {
        setIsSubmitting(true);
        if (selectedAccount) {
          await repo.updateAccount(selectedAccount.id, values);
          toast.success("Account updated successfully!");
        } else {
          await repo.createAccount(values as CreateAccountPayload);
          toast.success("Account created successfully!");
        }
        setDialogOpen(false);
        fetchAccounts(meta.page);
      } catch (err) {
        toast.error((err as Error).message || "Failed to process account");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchAccounts, meta.page, selectedAccount],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedAccount) return;
    try {
      setIsDeleting(true);
      await repo.deleteAccount(selectedAccount.id);
      toast.success(`Account deleted successfully!`);
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
      fetchAccounts(meta.page);
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedAccount, fetchAccounts, meta.page]);

  return {
    accounts,
    branches,
    meta,
    isLoading,
    searchQuery,
    roleFilter,
    setRoleFilter,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedAccount,
    isSubmitting,
    isDeleting,
    handleSearchChange,
    handlePageChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleDeleteConfirm,
  };
};

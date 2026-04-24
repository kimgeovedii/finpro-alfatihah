import { useCallback, useEffect, useRef, useState } from "react";
import {
  ProductCategory,
  PaginationMeta,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/features/manageCategories/types/manageCategory.type";
import { ManageCategoryRepository } from "@/features/manageCategories/repositories/manageCategory.repository";
import toast from "react-hot-toast";

const repo = new ManageCategoryRepository();

export const useManageCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);

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

  const fetchCategories = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const response = await repo.getAllCategories(
          page,
          meta.limit,
          debouncedSearch || undefined,
        );

        if (response && "data" in response) {
          setCategories(response.data);
          setMeta(response.meta);
        } else {
          setCategories([]);
        }
      } catch (err) {
        toast.error((err as Error).message || "Failed to load categories");
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    },
    [meta.limit, debouncedSearch],
  );

  useEffect(() => {
    fetchCategories(1);
  }, [debouncedSearch]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchCategories(page);
    },
    [fetchCategories],
  );

  const handleAddClick = useCallback(() => {
    setSelectedCategory(null);
    setAddDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((category: ProductCategory) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((category: ProductCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  }, []);

  const handleCreate = useCallback(
    async (values: CreateCategoryPayload) => {
      try {
        setIsSubmitting(true);
        await repo.createCategory(values);
        toast.success("Category created successfully!");
        setAddDialogOpen(false);
        fetchCategories(meta.page);
      } catch (err) {
        toast.error((err as Error).message || "Failed to create category");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchCategories, meta.page],
  );

  const handleUpdate = useCallback(
    async (values: UpdateCategoryPayload) => {
      if (!selectedCategory) return;
      try {
        setIsSubmitting(true);
        await repo.updateCategory(selectedCategory.id, values);
        toast.success("Category updated successfully!");
        setEditDialogOpen(false);
        setSelectedCategory(null);
        fetchCategories(meta.page);
      } catch (err) {
        toast.error((err as Error).message || "Failed to update category");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchCategories, meta.page, selectedCategory],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedCategory) return;
    try {
      setIsDeleting(true);
      await repo.deleteCategory(selectedCategory.id);
      toast.success(`"${selectedCategory.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);

      const newTotal = meta.total - 1;
      const newTotalPages = Math.ceil(newTotal / meta.limit) || 1;
      const targetPage = meta.page > newTotalPages ? newTotalPages : meta.page;

      fetchCategories(targetPage);
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCategory, fetchCategories, meta]);

  return {
    categories,
    meta,
    isLoading,
    searchQuery,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedCategory,
    isSubmitting,
    isDeleting,
    handleSearchChange,
    handlePageChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleCreate,
    handleUpdate,
    handleDeleteConfirm,
  };
};

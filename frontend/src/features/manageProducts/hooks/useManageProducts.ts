import { useCallback, useEffect, useRef, useState } from "react";
import {
  ManageProduct,
  PaginationMeta,
  CreateProductPayload,
  UpdateProductPayload,
  ProductCategory,
  AuthenticatedUser,
} from "@/features/manageProducts/types/manageProduct.type";
import { ManageProductRepository } from "@/features/manageProducts/repositories/manageProduct.repository";
import { useAuthService } from "@/features/auth/hooks/useAuthService";
import toast from "react-hot-toast";

const repo = new ManageProductRepository();

export const useManageProducts = () => {
  const { user, fetchUser, isLoading: userLoading } = useAuthService();
  const authUser = user as AuthenticatedUser;
  const [products, setProducts] = useState<ManageProduct[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!userLoading && (!authUser || !authUser.employee)) {
      fetchUser();
    }
  }, [fetchUser, userLoading, authUser]);

  const canManage =
    authUser?.employee?.role === "SUPER_ADMIN" ||
    (authUser as any)?.role === "SUPER_ADMIN";

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ManageProduct | null>(
    null,
  );
  const [selectedEditingProduct, setSelectedEditingProduct] =
    useState<ManageProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
  }, []);

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const response = await repo.getAllProducts(
          page,
          meta.limit,
          debouncedSearch || undefined,
          selectedCategory || undefined,
          sortBy,
          sortOrder,
        );

        if (Array.isArray(response)) {
          setProducts(response);
          setMeta((prev) => ({
            ...prev,
            total: response.length,
            page: 1,
            totalPages: 1,
          }));
        } else if (response && "data" in response) {
          setProducts(response.data);
          setMeta(response.meta);
        } else {
          setProducts([]);
        }
      } catch (err) {
        toast.error((err as Error).message || "Failed to load products");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [meta.limit, debouncedSearch, selectedCategory, sortBy, sortOrder],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const data = await repo.getAllCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && "data" in (data as any)) {
        setCategories((data as any).data);
      }
    } catch (err) {
      toast.error((err as Error).message || "Failed to load categories");
    }
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [debouncedSearch, selectedCategory, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchProducts(page);
    },
    [fetchProducts],
  );

  const handleAddClick = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const handleCreate = useCallback(
    async (values: CreateProductPayload) => {
      try {
        setIsSubmitting(true);
        await repo.createProduct(values);
        toast.success("Product created successfully!");
        setAddDialogOpen(false);
        fetchProducts(meta.page);
      } catch (err) {
        toast.error((err as Error).message || "Failed to create product");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchProducts, meta.page],
  );

  const handleEditClick = useCallback((product: ManageProduct) => {
    setSelectedEditingProduct(product);
    setEditDialogOpen(true);
  }, []);

  const handleUpdate = useCallback(
    async (values: UpdateProductPayload) => {
      if (!selectedEditingProduct) return;
      try {
        setIsUpdating(true);
        await repo.updateProduct(selectedEditingProduct.id, values);
        toast.success("Product updated successfully!");
        setEditDialogOpen(false);
        setSelectedEditingProduct(null);
        fetchProducts(meta.page);
      } catch (err) {
        toast.error((err as Error).message || "Failed to update product");
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchProducts, meta.page, selectedEditingProduct],
  );

  const handleDeleteClick = useCallback((product: ManageProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedProduct) return;
    try {
      setIsDeleting(true);
      await repo.deleteProduct(selectedProduct.id);
      toast.success(`"${selectedProduct.productName}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      const newTotal = meta.total - 1;
      const newTotalPages = Math.ceil(newTotal / meta.limit) || 1;
      const targetPage = meta.page > newTotalPages ? newTotalPages : meta.page;
      fetchProducts(targetPage);
    } catch (err) {
      toast.error((err as Error).message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedProduct, fetchProducts, meta]);

  return {
    products,
    meta,
    categories,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    sortOrder,

    addDialogOpen,
    setAddDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedProduct,
    selectedEditingProduct,
    isSubmitting,
    isDeleting,
    isUpdating,
    canManage,
    userLoading,
    user: authUser,

    handleSearchChange,
    handleCategoryChange: setSelectedCategory,
    handleSort: (field: string) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortOrder("asc");
      }
    },
    handlePageChange,
    handleAddClick,
    handleCreate,
    handleEditClick,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
  };
};

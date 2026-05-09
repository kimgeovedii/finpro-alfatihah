import { User } from "@/features/auth/types";

export type EmployeeRole = "STORE_ADMIN" | "SUPER_ADMIN";

export interface AuthenticatedUser extends User {
  employee?: {
    role: EmployeeRole;
  };
}

export type ProductImage = {
  id: string;
  imageUrl: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  deletedAt?: string | null;
};

export type ManageProduct = {
  id: string;
  productName: string;
  slugName: string;
  sku?: string;
  description: string;
  basePrice: number;
  category: ProductCategory;
  productImages: ProductImage[];
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ManageProductListResponse = {
  data: ManageProduct[];
  meta: PaginationMeta;
};

export type CreateProductPayload = {
  productName: string;
  slugName: string;
  description: string;
  categoryId: string;
  basePrice: number;
  sku: string;
  weight: number;
  images?: File[] | null;
};

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  existingImageIds?: string[] | null;
};

export type ProductHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  categories: ProductCategory[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  canManage?: boolean;
};

export type ProductTableProps = {
  products: ManageProduct[];
  isLoading: boolean;
  onEdit: (product: ManageProduct) => void;
  onDelete: (product: ManageProduct) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  canManage?: boolean;
};

export type ProductTableRowProps = {
  product: ManageProduct;
  index: number;
  onEdit: (product: ManageProduct) => void;
  onDelete: (product: ManageProduct) => void;
  canManage?: boolean;
};

export type ProductTablePaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

export type AddProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ProductCategory[];
  onSubmit: (values: CreateProductPayload) => Promise<void>;
  isSubmitting: boolean;
};

export type EditProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ProductCategory[];
  product: ManageProduct;
  onSubmit: (values: UpdateProductPayload) => Promise<void>;
  isUpdating: boolean;
};

export type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ManageProduct | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
};

export type MobileProductCardProps = {
  product: ManageProduct;
  index: number;
  onEdit: (product: ManageProduct) => void;
  onDelete: (product: ManageProduct) => void;
  canManage?: boolean;
};

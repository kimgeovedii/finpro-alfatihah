export interface ProductCategory {
  id: string;
  name: string;
  slugName: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ManageCategoryListResponse {
  data: ProductCategory[];
  meta: PaginationMeta;
}

export interface CreateCategoryPayload {
  name: string;
  slugName: string;
  description: string;
}

export interface UpdateCategoryPayload {
  name: string;
  slugName: string;
  description: string;
}

export interface CategoryHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  canManage?: boolean;
}

export interface CategoryTableProps {
  categories: ProductCategory[];
  isLoading: boolean;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  canManage?: boolean;
}

export interface CategoryTableRowProps {
  category: ProductCategory;
  index: number;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  canManage?: boolean;
}

export interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ProductCategory | null;
  onSubmit: (values: any) => Promise<any>;
  isSubmitting: boolean;
  title: string;
}

export interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ProductCategory | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

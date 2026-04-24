// ── API / Data Models ──

export type ProductImage = {
  id: string;
  imageUrl: string;
};

export type ProductCategory = {
  id: string;
  name: string;
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
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ── Component Props ──

export type ProductHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
};

export type ProductTableProps = {
  products: ManageProduct[];
  isLoading: boolean;
  onEdit: (product: ManageProduct) => void;
  onDelete: (product: ManageProduct) => void;
};

export type ProductTableRowProps = {
  product: ManageProduct;
  index: number;
  onEdit: (product: ManageProduct) => void;
  onDelete: (product: ManageProduct) => void;
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
};

export type DiscountType =
  | "PRODUCT_DISCOUNT"
  | "BUY_ONE_GET_ONE_FREE"
  | "MINIMUM_PURCHASE";
export type DiscountValueType = "PERCENTAGE" | "NOMINAL";

export interface IDiscount {
  id: string;
  name: string;
  discountType: DiscountType;
  discountValueType: DiscountValueType;
  discountValue: number;
  minPurchaseAmount?: number | null;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  status: "SCHEDULED" | "ACTIVE" | "EXPIRED";
  quota: number;
  branchId: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  productDiscounts?: IProductDiscount[];
  branch?: {
    storeName: string;
    city: string;
  };
}

export interface IProductDiscount {
  id: string;
  productId: string;
  discountId: string;
  product?: {
    productName: string;
  };
}

export interface ICreateDiscountRequest {
  name: string;
  discountType: DiscountType;
  discountValueType: DiscountValueType;
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount: number;
  startDate: string;
  endDate: string;
  quota: number;
  branchId: string;
  productIds?: string[];
}

export interface IUpdateDiscountRequest extends Partial<ICreateDiscountRequest> {}

export interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  user?: any;
}

export interface CreateDiscountDialogProps extends BaseDialogProps {
  onSubmit: (values: ICreateDiscountRequest) => Promise<void>;
}

export interface EditDiscountDialogProps extends BaseDialogProps {
  discount: IDiscount | null;
  onSubmit: (id: string, values: IUpdateDiscountRequest) => Promise<void>;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DiscountTablePaginationProps {
  meta: IPaginationMeta;
  onPageChange: (page: number) => void;
}

export interface DeleteDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: IDiscount | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export interface DiscountHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  canManage?: boolean;
}

export interface DiscountTableProps {
  discounts: IDiscount[];
  onEdit: (discount: IDiscount) => void;
  onDelete: (discount: IDiscount) => void;
  canManage?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

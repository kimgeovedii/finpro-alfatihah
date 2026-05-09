import {
  ManageProduct,
  PaginationMeta,
} from "@/features/manageProducts/types/manageProduct.type";
import { User } from "@/features/auth/types";

export type { ManageProduct, PaginationMeta };

export type EmployeeRole = "STORE_ADMIN" | "SUPER_ADMIN";

export interface Employee {
  id: string;
  fullName: string;
  role: EmployeeRole;
  branchId: string | null;
  userId: string | null;
}

export interface UserWithEmployee extends User {
  employee?: Employee;
}

export type Branch = {
  id: string;
  storeName: string;
  city: string;
  province: string;
};

export type BranchInventory = {
  id: string;
  branchId: string;
  productId: string;
  currentStock: number;
  branch?: Branch;
  product?: ManageProduct;
  updatedAt?: string;
};

export enum TransactionType {
  IN = "IN",
  OUT = "OUT",
}

export enum ReferenceType {
  ORDER = "ORDER",
  MANUAL = "MANUAL",
  MUTATION = "MUTATION",
}

export type StockJournal = {
  id: string;
  branchInventoryId: string;
  productId: string;
  transactionType: TransactionType;
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  referenceType: ReferenceType;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  product?: ManageProduct;
};

export type ManageStockListResponse = {
  data: BranchInventory[];
  meta: PaginationMeta;
};

export type StockJournalListResponse = {
  data: StockJournal[];
  meta: PaginationMeta;
};

export type StockHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedBranchId: string;
  onBranchChange: (value: string) => void;
  selectedStockStatus: string;
  onStatusChange: (value: string) => void;
  branches: Branch[];
  onAddClick: () => void;
  isStoreAdmin?: boolean;
};

export type StockTableProps = {
  inventory: BranchInventory[];
  isLoading: boolean;
  onUpdateStock: (item: BranchInventory) => void;
  onViewJournal: (item: BranchInventory) => void;
  isStoreAdmin?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (column: string) => void;
};

export type StockTableRowProps = {
  item: BranchInventory;
  index: number;
  onUpdateStock: (item: BranchInventory) => void;
  onViewJournal: (item: BranchInventory) => void;
  isStoreAdmin?: boolean;
};

export type UpdateStockPayload = {
  actualStock: number;
  notes: string;
};

export type UpdateStockDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItem: BranchInventory | null;
  onSubmit: (
    values: UpdateStockPayload & { productId?: string; branchId?: string },
  ) => Promise<void>;
  isSubmitting: boolean;
  branches: Branch[];
  allProducts: ManageProduct[];
  isStoreAdmin?: boolean;
  userBranchId?: string | null;
};

export type StockJournalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItem: BranchInventory | null;
  journals: StockJournal[];
  isLoading: boolean;
};

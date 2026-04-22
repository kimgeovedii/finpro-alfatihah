import { ManageProduct, PaginationMeta } from "@/features/manageProducts/types/manageProduct.type";

export enum SimulationRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  STORE_ADMIN = "STORE_ADMIN",
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

// ── Component Props ──

export type StockHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedBranchId: string;
  onBranchChange: (value: string) => void;
  branches: Branch[];
  simulationRole: SimulationRole;
  onRoleToggle: (role: SimulationRole) => void;
  onAddClick: () => void;
};

export type StockTableProps = {
  inventory: BranchInventory[];
  isLoading: boolean;
  onUpdateStock: (item: BranchInventory) => void;
  onViewJournal: (item: BranchInventory) => void;
  simulationRole: SimulationRole;
};

export type StockTableRowProps = {
  item: BranchInventory;
  index: number;
  onUpdateStock: (item: BranchInventory) => void;
  onViewJournal: (item: BranchInventory) => void;
  simulationRole: SimulationRole;
};

export type UpdateStockPayload = {
  actualStock: number;
  notes: string;
};

export type UpdateStockDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItem: BranchInventory | null;
  onSubmit: (values: UpdateStockPayload) => Promise<void>;
  isSubmitting: boolean;
};

export type StockJournalDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryItem: BranchInventory | null;
  journals: StockJournal[];
  isLoading: boolean;
};

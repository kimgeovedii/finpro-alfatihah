export type UserRole = "CUSTOMER" | "EMPLOYEE";
export type EmployeeRole = "STORE_ADMIN" | "SUPER_ADMIN";
export type RoleFilter = "ALL" | "CUSTOMER" | "EMPLOYEE" | "STORE_ADMIN" | "SUPER_ADMIN";

export type Branch = {
  id: string;
  storeName: string;
  city: string;
};

export type User = {
  id: string;
  username: string | null;
  email: string;
  role: UserRole;
  avatar: string | null;
  createdAt: string;
};

export type Employee = {
  id: string;
  fullName: string;
  role: EmployeeRole;
  branchId: string;
  branch: Branch;
  userId: string | null;
};

export type ManageAccount = User & {
  employee?: Employee;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ManageAccountListResponse = {
  data: ManageAccount[];
  meta: PaginationMeta;
};

export type CreateAccountPayload = {
  email: string;
  username?: string;
  fullName: string;
  role: EmployeeRole;
  branchId: string;
};

export type UpdateAccountPayload = Partial<CreateAccountPayload>;

export type AccountHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilter;
  onRoleFilterChange: (value: RoleFilter) => void;
  onAddClick: () => void;
};

export type AccountTableProps = {
  accounts: ManageAccount[];
  isLoading: boolean;
  onEdit: (account: ManageAccount) => void;
  onDelete: (account: ManageAccount) => void;
};

export type AccountTableRowProps = {
  account: ManageAccount;
  index: number;
  onEdit: (account: ManageAccount) => void;
  onDelete: (account: ManageAccount) => void;
};

export type AccountTablePaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

export type AccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branches: Branch[];
  account?: ManageAccount | null;
  onSubmit: (
    values: CreateAccountPayload | UpdateAccountPayload,
  ) => Promise<void>;
  isSubmitting: boolean;
};

export type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: ManageAccount | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
};

export type MobileAccountCardProps = {
  account: ManageAccount;
  index: number;
  onEdit: (account: ManageAccount) => void;
  onDelete: (account: ManageAccount) => void;
};

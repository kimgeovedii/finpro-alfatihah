export type DayName = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface BranchSchedule {
  id: string;
  branchId: string;
  startTime: string | null;
  endTime: string | null;
  dayName: DayName;
  isPlaceholder?: boolean;
}

export interface User {
  id: string;
  username: string | null;
  email: string;
  avatar: string | null;
}

export interface Employee {
  id: string;
  fullName: string;
  role: "STORE_ADMIN" | "SUPER_ADMIN";
  branchId: string;
  user: User | null;
  branch?: {
    storeName: string;
  };
}

export interface Branch {
  id: string;
  storeName: string;
  address: string;
  latitude: number;
  longitude: number;
  maxDeliveryDistance: number;
  isActive: boolean;
  isDefault: boolean;
  city: string;
  province: string;
  district?: string;
  village?: string;
  createdAt: string;
  updatedAt: string;
  schedules?: BranchSchedule[];
  employees?: Employee[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BranchListResponse {
  branches: Branch[];
  meta: PaginationMeta;
}

export interface EmployeeListResponse {
  employees: Employee[];
  meta: PaginationMeta;
}

export interface CreateBranchPayload {
  storeName: string;
  address: string;
  latitude: number;
  longitude: number;
  maxDeliveryDistance: number;
  city: string;
  province: string;
  district: string;
  village: string;
}

export interface UpdateBranchPayload extends Partial<CreateBranchPayload> {}

export interface CreateSchedulePayload {
  dayName: DayName;
  startTime: string;
  endTime: string;
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {}

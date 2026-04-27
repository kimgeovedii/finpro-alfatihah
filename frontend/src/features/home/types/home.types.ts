export interface BranchData {
  id: string;
  storeName: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  maxDeliveryDistance: number;
  schedules?: {
    dayName: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface ProductCard {
  id: string;
  productName: string;
  slugName: string;
  basePrice: number;
  currentStock: number;
  category: { id: string; name: string };
  productImages: { id: string; imageUrl: string }[];
  branchName?: string;
  branchId?: string;
  branchCity?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserAddress {
  id: string;
  label: string;
  type?: string;
  receiptName?: string;
  phone?: string;
  address: string;
  village?: string;
  district?: string;
  city: string;
  province: string;
  latitude: string | number;
  longitude: string | number;
  isPrimary: boolean;
}

export interface NearestBranchResponse {
  branch: BranchData;
  distance: number | null;
  isInRange: boolean;
  products: { data: ProductCard[]; meta: PaginationMeta };
}

export interface BranchData {
  id: string;
  storeName: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  maxDeliveryDistance: number;
}

export interface ProductCard {
  id: string;
  productName: string;
  slugName: string;
  basePrice: number;
  currentStock: number;
  category: { id: string; name: string };
  productImages: { id: string; imageUrl: string }[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NearestBranchResponse {
  branch: BranchData;
  distance: number | null;
  isInRange: boolean;
  products: { data: ProductCard[]; meta: PaginationMeta };
}

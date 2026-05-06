export interface ProductBreadCrumb {
  name: string;
}

export type ProductImage = {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
};

export type ProductCategory = {
  id: string;
  name: string;
};

export type BranchSchedule = {
  startTime: string;
  endTime: string;
  dayName: string;
};

export type BranchDetail = {
  storeName: string;
  address: string;
  openStatus: string;
  schedules: BranchSchedule[];
};

export type CartItem = {
  id: string;
  quantity: number;
  cart: {
    branchId: string;
  };
};

export type BranchInventory = {
  branchId: string;
  currentStock: number;
  branch: BranchDetail;
  cartItems: CartItem[];
};

export type ProductDetailData = {
  id: string;
  slugName: string;
  productName: string;
  description: string;
  sku: string;
  weight: number;
  categoryId: string;
  basePrice: number;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
  productImages: ProductImage[];
  branchInventories: BranchInventory[];
};

// Component Props
export type ProductDetailImageGalleryProps = {
  productImages: ProductImage[];
  productName: string;
};

export type ProductDetailInfoContentProps = {
  productName: string;
  categoryName: string;
  description: string;
  price: number;
};

export type ProductDetailCartActionProps = {
  qty: number;
  setQty: (qty: number) => void;
  price: number;
  totalPrice: number;
  variant: "mobile" | "desktop";
  isCreating: boolean;
  currentCartQty: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  disabled?: boolean;
};

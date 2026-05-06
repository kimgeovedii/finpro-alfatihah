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
  slugName: string;
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

export type Discount = {
  id: string;
  name: string;
  discountType:
    | "PRODUCT_DISCOUNT"
    | "BUY_ONE_GET_ONE_FREE"
    | "MINIMUM_PURCHASE";
  discountValueType: "PERCENTAGE" | "NOMINAL";
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  branchId?: string;
  deletedAt?: string | null;
};

export type ProductDiscount = {
  id: string;
  productId: string;
  discountId: string;
  discount: Discount;
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
  productDiscounts?: ProductDiscount[];
};

export type ProductDetailImageGalleryProps = {
  productImages: ProductImage[];
  productName: string;
};

export type ProductDetailInfoContentProps = {
  productName: string;
  categoryName: string;
  description: string;
  price: number;
  discountedPrice?: number;
};

export type ProductDetailCartActionProps = {
  role: string;
  qty: number;
  setQty: (qty: number) => void;
  price: number;
  discountedPrice?: number;
  totalPrice: number;
  variant: "mobile" | "desktop";
  isCreating: boolean;
  currentCartQty: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  disabled?: boolean;
};

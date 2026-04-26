export type DiscountType = "PRODUCT_DISCOUNT" | "BUY_ONE_GET_ONE_FREE" | "MINIMUM_PURCHASE";
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
  // If we fetch productDiscounts
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
}

export interface IUpdateDiscountRequest extends Partial<ICreateDiscountRequest> {}

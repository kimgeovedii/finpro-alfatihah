import { ProductDiscount } from "@/features/products/types/product.type";

export interface DiscountCalculationResult {
  discountedPrice: number;
  originalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  hasDiscount: boolean;
  activeDiscount?: ProductDiscount;
}

export const calculateDiscountedPrice = (
  basePrice: number,
  productDiscounts?: ProductDiscount[],
): DiscountCalculationResult => {
  const activeDiscount = productDiscounts?.find(
    (pd) => pd.discount.discountType === "PRODUCT_DISCOUNT",
  );

  if (!activeDiscount) {
    return {
      discountedPrice: basePrice,
      originalPrice: basePrice,
      discountAmount: 0,
      discountPercentage: 0,
      hasDiscount: false,
    };
  }

  const discount = activeDiscount.discount;
  let discountedPrice = basePrice;
  let discountAmount = 0;
  let discountPercentage = 0;

  if (discount.discountValueType === "PERCENTAGE") {
    discountPercentage = discount.discountValue;
    discountAmount = (basePrice * discount.discountValue) / 100;
    discountedPrice = basePrice - discountAmount;
  } else {
    // NOMINAL
    discountAmount = discount.discountValue;
    discountedPrice = Math.max(0, basePrice - discountAmount);
    discountPercentage = basePrice > 0 ? (discountAmount / basePrice) * 100 : 0;
  }

  return {
    discountedPrice,
    originalPrice: basePrice,
    discountAmount,
    discountPercentage: Math.round(discountPercentage),
    hasDiscount: true,
    activeDiscount,
  };
};

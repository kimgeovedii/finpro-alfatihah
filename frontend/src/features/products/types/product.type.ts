// API / Data Models
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

export type ProductDetailData = {
  id: string;
  slugName: string;
  productName: string;
  description: string;
  basePrice: number;
  category: ProductCategory;
  productImages: ProductImage[];
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
};

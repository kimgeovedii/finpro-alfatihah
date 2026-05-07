"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { ProductDetailImageGallery } from "./ProductDetailImageGallery";
import { ProductDetailInfoContent } from "./ProductDetailInfoContent";
import { ProductDetailCartAction } from "./ProductDetailCartAction";
import { ProductBreadcrumb } from "./ProductBreadCrumb";
import { BranchInfoCard } from "../../../components/layout/BranchInfoCard";
import { useProductActions } from "../hooks/useProductActions";
import { useStoreSelection } from "../hooks/useStoreSelection";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export const ProductDetail = ({
  slugName,
  storeName: storeNameProp,
}: {
  slugName: string;
  storeName?: string;
}) => {
  const user = useAuthStore((state) => state.user);
  const { storeName } = useStoreSelection(storeNameProp);
  const { product, isLoading, error, fetchProduct } = useProductDetail(
    slugName,
    storeName,
  );
  const { cartProps, isAvailable, branchInventory } = useProductActions(
    product,
    fetchProduct,
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-800 font-medium animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-base font-semibold text-slate-700">
            Unable to load product.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {error ?? "Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full bg-slate-50 min-h-screen text-slate-900"
      >
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col pb-12 p-4">
          <div className="w-full overflow-hidden">
            <ProductDetailImageGallery
              productImages={product.productImages}
              productName={product.productName}
            />
          </div>
          <div className="px-0 pt-6 pb-6 flex flex-col gap-6">
            <ProductDetailInfoContent
              productName={product.productName}
              categoryName={product.category.name}
              description={product.description}
              price={product.basePrice}
              discountedPrice={cartProps.discountedPrice}
            />
            {branchInventory ? (
              <BranchInfoCard branch={branchInventory.branch} />
            ) : (
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
                <p className="text-orange-800 font-bold text-sm">
                  Product not available in this area
                </p>
                <p className="text-orange-600 text-xs mt-1">
                  Please select another location or try again later.
                </p>
              </div>
            )}
            <ProductDetailCartAction
              {...cartProps}
              variant="mobile"
              role={user?.role ?? "GUEST"}
            />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block pt-10 pb-24 px-8 xl:px-12 max-w-[1600px] mx-auto">
          <div className="mb-8 flex gap-5 items-center">
            <ProductBreadcrumb
              productName={product.productName}
              categoryName={product.category.name}
              categorySlug={product.category.slugName}
            />
          </div>
          <div className="grid grid-cols-[1.2fr_1fr_0.8fr] gap-8 xl:gap-14 items-start">
            <div>
              <ProductDetailImageGallery
                productImages={product.productImages}
                productName={product.productName}
              />
            </div>
            <div>
              <ProductDetailInfoContent
                productName={product.productName}
                categoryName={product.category.name}
                description={product.description}
                price={product.basePrice}
                discountedPrice={cartProps.discountedPrice}
              />
              {branchInventory ? (
                <BranchInfoCard branch={branchInventory.branch} />
              ) : (
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
                  <p className="text-orange-800 font-bold text-sm">
                    Product not available in this area
                  </p>
                  <p className="text-orange-600 text-xs mt-1">
                    Please select another location or try again later.
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <ProductDetailCartAction
                {...cartProps}
                variant="desktop"
                role={user?.role ?? "GUEST"}
              />
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

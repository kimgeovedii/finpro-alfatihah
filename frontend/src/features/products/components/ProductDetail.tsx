"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductDetail } from "@/features/products/hooks/useProductDetail";
import { ProductDetailImageGallery } from "./ProductDetailImageGallery";
import { ProductDetailInfoContent } from "./ProductDetailInfoContent";
import { ProductDetailCartAction } from "./ProductDetailCartAction";
import { ProductBreadcrumb } from "./ProductBreadCrumb";
import { ProductBranchInfoCard } from "./ProductBranchInfo";
import Swal from "sweetalert2";
import { useCreateCart } from "../hooks/useCart";
import { useDeleteCartItem } from "../hooks/useCartItem";

export const ProductDetail = ({ slugName, storeName }: { slugName: string, storeName: string }) => {
  const { product, isLoading, error, fetchProduct } = useProductDetail(slugName, storeName);
  const [ qty, setQty ] = useState(1);
  const [ currentCartQty, setCurrentCartQty ] = useState(0)
  const { createCart, isCreating } = useCreateCart()
  const { deleteCartItem, isDeletingItem } = useDeleteCartItem()

  useEffect(() => {
    setCurrentCartQty(product?.branchInventories?.[0]?.cartItems?.[0]?.quantity ?? 0)
  }, [product])

  // Handle action
  const handleAddToCart = async (branchId: string, productId: string, qty: number) => {
    const success = await createCart(branchId, productId, qty)

    if (success) {
      await Swal.fire({
        title: "Product Added!",
        text: "Item has been added to your cart.",
        icon: "success",
        confirmButtonColor: "#10b981",
      })

      setQty(1)
      fetchProduct()
    }
  }

  const handleRemoveCartItem = async (cartItemId: string, productName: string) => {
    const confirm = await Swal.fire({
      title: "Remove product?",
      html: `<b>${productName}</b> will be remove from your cart.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    })
    if (!confirm.isConfirmed) return

    const success = await deleteCartItem(cartItemId)
    if (success) {
      await Swal.fire({
        title: "Item deleted",
        html: `<b>${productName}</b> has been removed.`,
        icon: "success",
        confirmButtonColor: "#10b981",
      })

      setQty(1)
      fetchProduct()
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-800 font-medium animate-pulse">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
          <p className="text-base font-semibold text-slate-700">Unable to load product.</p>
          <p className="mt-2 text-sm text-slate-500">{error ?? "Please try again later."}</p>
        </div>
      </div>
    );
  }

  const cartProps = {
    qty,
    setQty,
    price: product.basePrice,
    totalPrice: product.basePrice * qty,
    isCreating,
    onAddToCart: () =>
      handleAddToCart(
        product.branchInventories[0].branchId,
        product.id,
        qty 
      ),
    currentCartQty,
    onRemoveFromCart: () => handleRemoveCartItem(
      product?.branchInventories?.[0]?.cartItems?.[0]?.id,
      product.productName
      )
  };

  return (
    <AnimatePresence mode="wait">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full bg-slate-50 min-h-screen text-slate-900"
      >
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col pb-32">
          <div className="w-full overflow-hidden">
            <ProductDetailImageGallery
              productImages={product.productImages}
              productName={product.productName}
            />
          </div>

          <div className="px-5 pt-6 pb-6 flex flex-col gap-6">
            <ProductDetailInfoContent
              productName={product.productName}
              categoryName={product.category.name}
              description={product.description}
              price={product.basePrice}
            />

            <ProductBranchInfoCard branch={{
              storeName: product.branchInventories[0].branch.storeName,
              address: product.branchInventories[0].branch.address,
              schedules: product.branchInventories[0].branch.schedules
            }}/>

            <ProductDetailCartAction {...cartProps} variant="mobile" />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block pt-10 pb-24 px-8 xl:px-12 max-w-[1600px] mx-auto">
          <div className="mb-8">
            <ProductBreadcrumb name={product.productName} />
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
              />
              <ProductBranchInfoCard branch={{
                storeName: product.branchInventories[0].branch.storeName,
                address: product.branchInventories[0].branch.address,
                schedules: product.branchInventories[0].branch.schedules
              }}/>
            </div>

            <div className="sticky top-24">
              <ProductDetailCartAction {...cartProps} variant="desktop" />
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

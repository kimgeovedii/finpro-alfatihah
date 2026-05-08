import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useCreateCart } from "./useCart";
import { useDeleteCartItem } from "./useCartItem";
import { ProductDetailData } from "../types/product.type";

export const useProductActions = (
  product: ProductDetailData | null,
  fetchProduct: () => void,
) => {
  const [qty, setQty] = useState(1);
  const [currentCartQty, setCurrentCartQty] = useState(0);
  const { createCart, isCreating } = useCreateCart();
  const { deleteCartItem, isDeletingItem } = useDeleteCartItem();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    setCurrentCartQty(
      product?.branchInventories?.[0]?.cartItems?.[0]?.quantity ?? 0,
    );
  }, [product]);

  const handleCreateCart = useCallback(
    async (branchId: string, productId: string, qty: number) => {
      const success = await createCart(branchId, productId, qty);

      if (success) {
        await Swal.fire({
          title: "Product Added!",
          text: "Item has been added to your cart.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });

        setQty(1);
        fetchProduct();
      }
    },
    [createCart, fetchProduct],
  );

  const handleRemoveCartItem = useCallback(
    async (cartItemId: string, productName: string) => {
      const confirm = await Swal.fire({
        title: "Remove product?",
        html: `<b>${productName}</b> will be remove from your cart.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#ef4444",
      });
      if (!confirm.isConfirmed) return;

      const success = await deleteCartItem(cartItemId);
      if (success) {
        await Swal.fire({
          title: "Item deleted",
          html: `<b>${productName}</b> has been removed.`,
          icon: "success",
          confirmButtonColor: "#10b981",
        });

        setQty(1);
        fetchProduct();
      }
    },
    [deleteCartItem, fetchProduct],
  );

  const branchInventory = product?.branchInventories?.[0];
  const isAvailable = !!branchInventory;

  const activeDiscount = product?.productDiscounts?.[0]?.discount;
  let discountedPrice = product?.basePrice || 0;

  if (activeDiscount) {
    if (activeDiscount.discountValueType === "PERCENTAGE") {
      discountedPrice =
        discountedPrice -
        (discountedPrice * activeDiscount.discountValue) / 100;
    } else {
      discountedPrice = Math.max(
        0,
        discountedPrice - activeDiscount.discountValue,
      );
    }
  }

  const cartProps = {
    qty,
    setQty,
    price: product?.basePrice || 0,
    discountedPrice: activeDiscount ? discountedPrice : undefined,
    totalPrice: discountedPrice * qty,
    isCreating,
    onAddToCart: () => {
      if (!user) {
        router.push("/login");
        return;
      }
      if (isAvailable && product) {
        handleCreateCart(branchInventory.branchId, product.id, qty);
      }
    },
    currentCartQty,
    onRemoveFromCart: () =>
      handleRemoveCartItem(
        branchInventory?.cartItems?.[0]?.id || "",
        product?.productName || "",
      ),
    disabled: !isAvailable,
  };

  return {
    cartProps,
    isAvailable,
    branchInventory,
  };
};

"use client";
import { useAllCartData, useCartSummary, useDeleteCart, useDeleteCartItem, useUpdateCartItem } from "@/features/cart/hooks/useCart"
import { CartSummary } from "@/features/cart/components/CartSummary"
import { BranchHeader } from "@/features/cart/components/BranchHeader";
import { CartItemCard } from "@/features/cart/components/CartItemCard";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { summary, isLoading, fetchCartSummary } = useCartSummary()
  const { carts, meta, isLoadingAllCart, fetchAllCarts } = useAllCartData()
  const { deleteCart, isDeleting } = useDeleteCart()
  const { deleteCartItem, isDeletingItem } = useDeleteCartItem()
  const { updateCartItem, isUpdatingItem } = useUpdateCartItem()

  const handleRemoveCart = async (cartId: string) => {
    const confirm = await Swal.fire({
      title: "Remove cart?",
      text: "All items in this cart will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    })
    if (!confirm.isConfirmed) return

    const success = await deleteCart(cartId)
    if (success) {
      await Swal.fire({
        title: "Cart deleted",
        text: "Your cart has been removed.",
        icon: "success",
        confirmButtonColor: "#10b981",
      })

      fetchCartSummary()
      fetchAllCarts(1)
    }
  }

  const handleRemoveCartItem = async (cartItemId: string, productName: string) => {
    const confirm = await Swal.fire({
      title: "Remove cart item?",
      html: `<b>${productName}</b> items in this cart will be deleted.`,
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

      fetchCartSummary()
      fetchAllCarts(1)
    }
  }

  const handleIncrease = async (itemId: string, qty: number, stock: number) => {
    if (qty >= stock) {
      Swal.fire({
        icon: "info",
        title: "Stock limit reached",
        text: "You already selected all available items.",
        confirmButtonColor: "#10b981",
      })
      return
    }
  
    await updateCartItem(itemId, qty + 1)
    fetchCartSummary()
    fetchAllCarts(1)
  }
  
  const handleDecrease = async (cartItemId: string, qty: number, productName: string) => {
    if (qty <= 1) {
      const confirm = await Swal.fire({
        title: "Remove item?",
        html: `<b>${productName}</b> will be removed from cart.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove",
        confirmButtonColor: "#ef4444",
      })
  
      if (!confirm.isConfirmed) return
  
      const success = await deleteCart(cartItemId)
      if (success) {
        await Swal.fire({
          title: "Item deleted",
          html: `<b>${productName}</b> has been removed.`,
          icon: "success",
          confirmButtonColor: "#10b981",
        })

        fetchCartSummary()
        fetchAllCarts(1)
      }
    } else {
      await updateCartItem(cartItemId, qty - 1)
    }
  
    fetchCartSummary()
    fetchAllCarts(1)
  }
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Your Basket
          </h1>
          {
            isLoading ? <p className="text-slate-400 mt-1">Loading...</p> : 
              <CartSummary
                totalItems={summary?.totalItems ?? 0}
                totalQty={summary?.totalQty ?? 0}
              />
          }
          <hr className="my-5"/>
          <div>
            {
              isLoadingAllCart ? (
              <p className="text-slate-400">Loading carts...</p>
            ) : carts.length === 0 ? (
              <p className="text-slate-500">No items in cart</p>
            ) : (
              carts.map((cart: any) => (
                <div key={cart.id} className="mb-6">
                  <BranchHeader id={cart.branch.id} storeName={cart.branch.storeName} onRemove={() => handleRemoveCart(cart.id)} cartId={cart.id}/>
                  {
                    cart.items.map((dt: any) => (
                      <CartItemCard key={dt.id}
                        slugName={dt.product.id} branchId={cart.branchId} productName={dt.product.product.productName} description={dt.product.product.description} 
                        basePrice={dt.product.product.basePrice} mainImage="/mainImages/coke.png" qty={dt.quantity} currentStock={dt.product.currentStock}
                        onDecrease={() => handleDecrease(dt.id, dt.quantity,dt.product.product.productName)}
                        onIncrease={() => handleIncrease(dt.id, dt.quantity, dt.product.currentStock)}                        
                        onRemove={() => handleRemoveCartItem(dt.id, `(${dt.quantity}) ${dt.product.product.productName}`)}
                      />
                    ))
                  }
                </div>
              ))
            )}
            { meta && meta.page < meta.total_page && <Button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg" onClick={() => fetchAllCarts(meta.page + 1)}>See More</Button> }
          </div>
        </div>
      </div>
    </div>
  )
}
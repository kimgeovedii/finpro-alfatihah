"use client";
import { Button } from '@/components/ui/button';
import { AddressSelectionCard } from '@/features/cart/components/AddressSelectionCard';
import { CartDetailItemListCard } from '@/features/cart/components/CartDetailItemListCard';
import { CartPaymentSummaryCard } from '@/features/cart/components/CartPaymentSummaryCard';
import { PaymentMethodSelect } from '@/features/cart/components/PaymentMethodSelect';
import { VouchersSelectionCard } from '@/features/cart/components/VouchersSelectionCard';
import { useCartDetailData, useCheckoutCartItem, useDeleteCart, useDeleteCartItem, useUpdateCartItem } from '@/features/cart/hooks/useCart';
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { formatListSchedule } from '@/utils/converter.util';
import { SkeletonBox } from '@/components/layout/SkeletonBox';

export default function CartDetailPage() {
  // Handle param
  const params = useParams()
  const cartId = params?.cartId as string

  // Handle hook
  const router = useRouter()
  const { cart, isLoading, error, fetchCartDetail } = useCartDetailData(cartId)
  const { checkoutCartItem, isCheckoutItem } = useCheckoutCartItem()
  const [ appliedVoucher, setAppliedVoucher ] = useState<string | null>(null)
  const [ selectedAddressId, setSelectedAddressId ] = useState<string | null>(null)
  const [ paymentMethod, setPaymentMethod ] = useState<"MANUAL" | "GATEWAY">("MANUAL")
  const { deleteCartItem, isDeletingItem } = useDeleteCartItem()
  const { updateCartItem, isUpdatingItem } = useUpdateCartItem()

  // Handle hook fetching
  useEffect(() => {
    if (!isLoading && !cart && error) {
      Swal.fire({
        icon: "error",
        title: "Cart not found",
        text: error,
        confirmButtonText: "Back to Cart",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) router.push('/')
      })
    }

    if (cart?.user?.addresses?.length) {
      const primary = cart.user.addresses.find(dt => dt.isPrimary) ?? cart.user.addresses[0]
      setSelectedAddressId(primary.id)
    }
  }, [cart, isLoading, error, router])

  // Handle action
  const handleApply = (code: string) => setAppliedVoucher(code)

  const handleRemove = () => setAppliedVoucher(null)

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

      fetchCartDetail(cartId)
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
    fetchCartDetail(cartId)
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
  
      const success = await deleteCartItem(cartItemId)
      if (success) {
        await Swal.fire({
          title: "Item deleted",
          html: `<b>${productName}</b> has been removed.`,
          icon: "success",
          confirmButtonColor: "#10b981",
        })

        fetchCartDetail(cartId)
      }
    } else {
      await updateCartItem(cartItemId, qty - 1)
    }
  
    fetchCartDetail(cartId)
  }

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      Swal.fire({
        icon: "warning",
        title: "Please select an address",
        confirmButtonColor: "#10b981",
      })
      return
    }

    const confirmResult = await Swal.fire({
      icon: "question",
      title: "Confirm Checkout",
      text: "Are you sure you want to place this order?",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, place order",
      cancelButtonText: "Cancel",
    })
    if (!confirmResult.isConfirmed) return

    const { success, redirectUrl } = await checkoutCartItem(cartId, selectedAddressId, paymentMethod, appliedVoucher ?? undefined)
    if (!success) {
      Swal.fire({
        icon: "error",
        title: "Checkout failed",
        text: "Something went wrong",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    if (paymentMethod === "GATEWAY" && redirectUrl) {
      window.location.href = redirectUrl
      return
    }

    Swal.fire({
      icon: "success",
      title: "Order placed!",
      text: "Your order has been submitted.",
      confirmButtonColor: "#10b981",
    }).then(() => router.push("/transaction"))
  }  

  // Render loading element
  if (isLoading || !cart) {
    return (
      <div className="flex flex-col space-y-2">
        <div className='flex w-full gap-3'>
          <div className='flex-1 flex flex-col space-y-2'>
            <SkeletonBox extraClass={'min-h-[400px]'}/>
            <SkeletonBox extraClass={'min-h-[360px]'}/>
          </div>
          <div className='flex-1 flex flex-col space-y-2'>
            <SkeletonBox extraClass={'min-h-[190px]'}/>
            <SkeletonBox extraClass={'min-h-[190px]'}/>
            <SkeletonBox extraClass={'min-h-[360px]'}/>
          </div>
        </div>
      </div>
    )
  }

  // Calculate price
  const shippingCost = cart.shipping?.shippingCost ?? 0
  const totalBasePrice = cart.totalBasePrice
  
  // Format shop's schedule
  const scheduleText = cart?.branch?.schedules ? formatListSchedule(cart?.branch?.schedules) : '-'
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className='flex items-center gap-3 mb-5'>
        <Link href={'/cart'}>
          <Button variant='destructive' className='text-md px-3 py-5'>
            <ArrowLeftIcon className="w-4 h-4"/> Back
          </Button>
        </Link>
      </div>
      <div className='flex flex-col lg:flex-row w-full gap-5'>
        <div className='w-full lg:flex-1 flex flex-col space-y-5'>
          <AddressSelectionCard
            branch={{
              name: cart?.branch.storeName,
              address: cart.branch.address,
              schedule: scheduleText,
              statusOpen: cart.openStatus,
            }}
            selectedAddressId={selectedAddressId}
            onSelect={(id: string) => setSelectedAddressId(id)}
            addressList={
              cart.user.addresses.map(dt => ({
                id: dt.id,
                label: dt.label,
                address: dt.address,
                receiptName: dt.receiptName,
                phone: dt.phone,
                isPrimary: dt.isPrimary,
                distance: cart.shipping?.distance ?? 0
              }))
            }
          />
          <VouchersSelectionCard
            appliedVoucher={appliedVoucher}
            onApply={handleApply}
            onRemove={handleRemove}
          />
        </div>
        <div className='w-full lg:flex-1 flex flex-col space-y-5'>
            <CartDetailItemListCard
              cartId={cartId}
              items={
                cart.items.map(dt => ({
                  id: dt.id,
                  cartId: cartId,
                  productName: dt.product.product.productName,
                  description: dt.product.product.description,
                  category: dt.product.product.category,
                  productImages: dt.product.product.productImages,
                  quantity: dt.quantity,
                  currentStock: dt.product.product.currentStock,
                  weight: dt.product.product.weight * dt.quantity,
                  basePrice: dt.product.product.basePrice,
                  totalPrice: dt.product.product.basePrice * dt.quantity
                }))
              }
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemoveCartItem}
          />
          <PaymentMethodSelect selectedMethod={paymentMethod} onSelectMethod={setPaymentMethod}/>
          <CartPaymentSummaryCard
            totalItem={cart.totalQty}
            shippingWeight={cart.totalWeight}
            shippingCost={cart.shipping?.shippingCost ?? 0}
            totalPrice={cart.totalBasePrice}
            totalDiscountProduct={0}
            totalDiscountVoucher={0}
            finalPrice={shippingCost + totalBasePrice}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  )
}
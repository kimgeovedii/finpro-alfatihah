"use client";
import { AddressSelectionCard } from '@/features/cart/components/AddressSelectionCard';
import { CartDetailItemListCard } from '@/features/cart/components/CartDetailItemListCard';
import { CartPaymentSummaryCard } from '@/features/cart/components/CartPaymentSummaryCard';
import { PaymentMethodSelect } from '@/features/cart/components/PaymentMethodSelect';
import { VouchersSelectionCard } from '@/features/cart/components/VouchersSelectionCard';
import { useCartDetailData } from '@/features/cart/hooks/useCart';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { SkeletonBox } from '@/components/layout/SkeletonBox';
import { BackButton } from '@/components/button/BackButton';
import { actionMessages } from '@/constants/message.const';
import { HeadingText } from '@/components/layout/HeadingText';
import { useCartActions } from '@/features/cart/hooks/useCartAction';

type Props = {
    cartId: string
}
  
export function CartDetailLayout({ cartId }: Props) {
    // Handle hook (fetch)
    const router = useRouter()
    const { cart, isLoading, error, fetchCartDetail } = useCartDetailData(cartId)

    // Handle hook (action)
    const onSuccess = () => fetchCartDetail(cartId)
    const {
        selectedVoucher, selectedAddressId, setSelectedAddressId, paymentMethod, setPaymentMethod, localQty,
        handleApply, handleRemove, handleRemoveCartItem, handleIncrease, handleDecrease, handleCheckout,
    } = useCartActions(onSuccess, cartId)

    // Handle hook (fetch)
    useEffect(() => {
        if (!isLoading && !cart && error) {
            Swal.fire({
                icon: "error",
                title: actionMessages.cartFailedOpen,
                text: error,
                confirmButtonText: actionMessages.cartAskBack,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) router.push('/cart')
            })
        }

        if (cart?.user?.addresses?.length) {
            // Return address selected based on primary status and within range
            const selectedAddress = (() => {
                const primary = cart?.user?.addresses?.find(dt => dt.isPrimary && dt.isWithinRange)
                if (primary) return primary

                return cart?.user?.addresses?.find(dt => dt.isWithinRange) ?? cart.user.addresses[0]
            })()

            setSelectedAddressId(selectedAddress.id)
        }
    }, [cart, isLoading, error, router])

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
    const productFinalPrice = cart.finalTotalPrice
    
    const voucherDiscount = (() => {
        if (!selectedVoucher) return 0
    
        // Min purchase validation
        if (selectedVoucher.minPurchaseAmount && productFinalPrice < selectedVoucher.minPurchaseAmount) return 0

        const voucherTargetPrice = selectedVoucher.type === "SHIPPING_COST" ? shippingCost : productFinalPrice
    
        // Percentage calculation
        let discount = 0
        if (selectedVoucher.discountValueType === "PERCENTAGE") {
            // Prevent discount more than 100%
            const percentage = Math.min(Math.max(selectedVoucher.discountValue, 0), 100)

            discount = (voucherTargetPrice * percentage) / 100
        } else {
            // Prevent negative discount
            discount = Math.max(selectedVoucher.discountValue, 0)
        }
    
        // Make sure discount use based on max amount
        if (selectedVoucher.maxDiscountAmount) discount = Math.min(discount, selectedVoucher.maxDiscountAmount)
    
        // Prevent over-discount
        discount = Math.min(discount, voucherTargetPrice)
    
        return Math.ceil(discount)
    })()

    // Final calculation
    let finalProductPrice = productFinalPrice
    let finalShipping = shippingCost

    // Implement discount based on type
    if (selectedVoucher) {
        if (selectedVoucher.type === "ORDER") finalProductPrice = Math.max(0, productFinalPrice - voucherDiscount)
        if (selectedVoucher.type === "SHIPPING_COST") finalShipping = Math.max(0, shippingCost - voucherDiscount)
    }
    const finalPrice = Math.round(finalProductPrice + finalShipping)
    
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full mx-auto">
            <div className='flex gap-5 items-center'>
                <BackButton url="cart"/>
                <HeadingText children="Cart Detail" level={1}/>
            </div>
            <div className='flex flex-col lg:flex-row w-full gap-5'>
                <div className='w-full lg:flex-1 flex flex-col space-y-5'>
                <AddressSelectionCard
                    branch={cart.branch}
                    selectedAddressId={selectedAddressId}
                    onSelect={(id: string) => setSelectedAddressId(id)}
                    addressList={cart.user.addresses}
                    maxDeliveryDistance={cart.branch.maxDeliveryDistance}
                />
                <VouchersSelectionCard
                    appliedVoucher={selectedVoucher?.voucherCode}
                    onApply={handleApply}
                    onRemove={handleRemove}
                    totalBasePrice={productFinalPrice}
                />
                </div>
                <div className='w-full lg:flex-1 flex flex-col space-y-5'>
                    <CartDetailItemListCard
                        cartId={cartId}
                        branchName={cart.branch.storeName}
                        items={
                            cart.items.map(dt => ({
                                id: dt.id,
                                cartId,
                                ...dt.product.product,
                                quantity: localQty[dt.id] ?? dt.quantity,
                                currentStock: dt.product.currentStock,
                                weight: dt.product.product.weight * (localQty[dt.id] ?? dt.quantity),
                                totalPrice: dt.product.product.basePrice * (localQty[dt.id] ?? dt.quantity),
                            }))
                        }
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onRemove={handleRemoveCartItem}
                    />
                <PaymentMethodSelect 
                    selectedMethod={paymentMethod} 
                    onSelectMethod={setPaymentMethod}
                />
                <CartPaymentSummaryCard
                    totalItem={cart.totalQty}
                    shippingWeight={cart.totalWeight}
                    shippingCost={shippingCost}
                    totalPrice={cart.totalBasePrice}
                    totalDiscountProduct={cart.totalDiscountProduct}
                    totalDiscountVoucher={voucherDiscount}
                    finalPrice={finalPrice}
                    onCheckout={handleCheckout}
                />
                </div>
            </div>
        </div>
    )
}
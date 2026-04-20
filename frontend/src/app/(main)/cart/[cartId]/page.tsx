"use client";
import { Button } from '@/components/ui/button';
import { AddressSelectionCard } from '@/features/cart/components/AddressSelectionCard';
import { CartDetailItemListCard } from '@/features/cart/components/CartDetailItemListCard';
import { CartPaymentSummaryCard } from '@/features/cart/components/CartPaymentSummaryCard';
import { PaymentMethodSelect } from '@/features/cart/components/PaymentMethodSelect';
import { VouchersSelectionCard } from '@/features/cart/components/VouchersSelectionCard';
import { useCartDetailData } from '@/features/cart/hooks/useCart';
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { formatListSchedule } from '@/utils/converter.util';

const vouchersData = [
  { code: "DISC10", description: "Discount 10%" },
  { code: "FREESHIP", description: "Free Shipping" },
  { code: "WELCOME", description: "Welcome Bonus" },
]

export default function CartDetailPage() {
  const router = useRouter()
  const params = useParams()
  const cartId = params?.cartId as string

  const { cart, isLoading, error } = useCartDetailData(cartId)

  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null)
  const handleApply = (code: string) => setAppliedVoucher(code)
  const handleRemove = () => setAppliedVoucher(null)

  useEffect(() => {
    if (!isLoading && !cart && error) {
      Swal.fire({
        icon: "error",
        title: "Cart Not Found",
        text: error,
        confirmButtonText: "Back to Cart",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) router.push('/')
      })
    }
  }, [cart, isLoading, error, router])

  if (isLoading || !cart) return <div className="p-10 text-center text-slate-400">Loading...</div>

  const shippingCost = cart.shipping?.shippingCost ?? 0
  const totalBasePrice = cart.totalBasePrice
  const scheduleText = cart?.branch?.schedules ? formatListSchedule(cart?.branch?.schedules) : '-'
  const addressList = cart.user.addresses.map(dt => ({
    id: dt.id,
    label: dt.label,
    address: dt.address,
    receiptName: dt.receiptName,
    phone: dt.phone,
    distance: cart.shipping?.distance ?? 0
  }))
  const items = cart.items.map((dt, idx) => ({
    id: dt.id,
    productName: dt.product.product.productName,
    description: dt.product.product.description,
    category: dt.product.product.category.name,
    imageUrl: dt.product.product.productImages?.[0]?.imageUrl,
    quantity: dt.quantity,
    basePrice: dt.product.product.basePrice,
    totalPrice: dt.product.product.basePrice * dt.quantity
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto">
      <div className='flex items-center gap-3 mb-5'>
        <Link href={'/cart'}>
          <Button variant='destructive' className='text-md px-3 py-5'>
            <ArrowLeftIcon className="w-4 h-4"/> Back
          </Button>
        </Link>
      </div>
      <div className='flex w-full gap-5'>
        <div className='flex-1 flex flex-col space-y-5'>
          <AddressSelectionCard
            branch={{
              name: cart?.branch.storeName,
              address: cart.branch.address,
              schedule: scheduleText,
              statusOpen: cart.openStatus,
            }}
            addressList={addressList}
          />
          <VouchersSelectionCard
            vouchers={vouchersData}
            appliedVoucher={appliedVoucher}
            onApply={handleApply}
            onRemove={handleRemove}
          />
        </div>
        <div className='flex-1 flex flex-col space-y-5'>
          <CartDetailItemListCard
            items={items}
          />
          <PaymentMethodSelect selectedMethod={'MANUAL'} onSelectMethod={()=>{}}/>
          <CartPaymentSummaryCard
            totalItem={cart.totalQty}
            shippingCost={cart.shipping?.shippingCost ?? 0}
            totalPrice={cart.totalBasePrice}
            totalDiscountProduct={0}
            totalDiscountVoucher={0}
            finalPrice={shippingCost + totalBasePrice}
          />
        </div>
      </div>
    </div>
  )
}
"use client";
import { Button } from '@/components/ui/button';
import { AddressSelectionCard } from '@/features/cart/components/AddressSelectionCard';
import { CartDetailItemListCard } from '@/features/cart/components/CartDetailItemListCard';
import { CartPaymentSummaryCard } from '@/features/cart/components/CartPaymentSummaryCard';
import { PaymentMethodSelect } from '@/features/cart/components/PaymentMethodSelect';
import { VouchersSelectionCard } from '@/features/cart/components/VouchersSelectionCard';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const vouchersData = [
  { code: "DISC10", description: "Discount 10%" },
  { code: "FREESHIP", description: "Free Shipping" },
  { code: "WELCOME", description: "Welcome Bonus" },
]

const addressList = [
  {
    id: "ADDR-1",
    label: "Home",
    address: "Jl. Mawar No. 1",
    receiptName: "Leo",
    phone: "08114882001",
    distance: 2
  },
  {
    id: "ADDR-2",
    label: "Office",
    address: "Jl. Melati No. 99",
    receiptName: "Leo",
    phone: "08114882001",
    distance: 5
  }
]

export default function CartDetailPage() {
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null)

  const handleApply = (code: string) => setAppliedVoucher(code)
  const handleRemove = () => setAppliedVoucher(null)
  
  const params = useParams()
  const orderNumber = params?.orderNumber as string

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
              name: 'Toko Cabang Surabaya',
              address: 'Jl. Tunjungan No. 88, Genteng, Surabaya',
              schedule: 'MON (08:30 - 21:30), TUE (08:30 - 21:30), WED (08:30 - 21:30), FRI (08:30 - 21:30), SUN (08:30 - 21:30)',
              statusOpen: "Open",
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
            items={[
              {
                branchInventoriesId: "INV-001",
                productName: "Coca Cola",
                description: "Soda",
                category: "Drinks",
                imageUrl: "https://via.placeholder.com/150",
                quantity: 1,
                basePrice: 120000,
                totalPrice: 120000,
              }
            ]}
          />
          <PaymentMethodSelect selectedMethod={'MANUAL'} onSelectMethod={()=>{}}/>
          <CartPaymentSummaryCard
            totalItem={2}
            shippingCost={10000}
            totalPrice={200000}
            totalDiscountProduct={1000}
            totalDiscountVoucher={1000}
            finalPrice={50000}
          />
        </div>
      </div>
    </div>
  )
}
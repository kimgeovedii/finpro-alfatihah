"use client";
import { Button } from '@/components/ui/button';
import { CartPaymentSummaryCard } from '@/features/cart/components/CartPaymentSummaryCard';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CartDetailPage() {
  // For repo fetching
  const params = useParams()
  const orderNumber = params?.orderNumber as string

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto w-full">
      <div className='flex items-center gap-3 mb-5'>
        <Link href={'/cart'}>
          <Button variant='destructive' className='text-md px-3 py-5'>
            <ArrowLeftIcon className="w-4 h-4"/> Back
          </Button>
        </Link>
      </div>
      <div className='flex w-full gap-5'>
        <div className='flex-1 flex flex-col space-y-5'>
          
        </div>
        <div className='flex-1 flex flex-col space-y-5'>
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
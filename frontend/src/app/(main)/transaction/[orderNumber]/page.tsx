"use client";
import { Button } from '@/components/ui/button';
import { PaymentSummaryCard } from '@/features/order/components/PaymentSummary';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TransactionDetailPage() {
  // For repo fetching
  const params = useParams()
  const orderNumber = params?.orderNumber as string

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-[1080px] mx-auto w-full">
      <div className='flex items-center gap-3 mb-5'>
        <Link href={'/transaction'}>
          <Button variant='destructive' className='text-md px-3 py-5'><ArrowLeftIcon className="w-4 h-4"/> Back</Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Order <span>{orderNumber}</span>
        </h1>
      </div>
      <PaymentSummaryCard totalItem={2} shippingCost={10000} totalPrice={15000} totalSaving={2000} finalPrice={22000}/>
    </div>
  )
}
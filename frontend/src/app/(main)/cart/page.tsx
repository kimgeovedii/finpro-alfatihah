"use client"

import React from 'react'
import { useUser } from '@/features/auth/hooks/useUser'
import { CartSummary } from '@/features/cart/components/CartSummary'

export default function CartPage() {
  const { user, isLoading } = useUser()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Your Basket</h1>
          <CartSummary totalProducts={1} totalItems={3} />
        </div>
      </div>
    </div>
  )
}
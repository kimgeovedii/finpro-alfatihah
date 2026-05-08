import { DividerLine } from "@/components/layout/DividerLine"
import { HeadingText } from "@/components/layout/HeadingText"
import { ShippingSummaryCard } from "@/components/layout/ShippingSummaryCard"
import { Button } from "@/components/ui/button"
import { currencyFormat } from "@/constants/business.const"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import React from "react"

type Props = {
    totalItem: number
    shippingCost: number
    shippingWeight: number
    totalPrice: number
    totalDiscountProduct: number
    totalDiscountVoucher: number
    finalPrice: number
    onCheckout: () => void
}

export const CartPaymentSummaryCard: React.FC<Props> = ({ totalItem, shippingCost, totalPrice, totalDiscountProduct, totalDiscountVoucher, finalPrice, shippingWeight, onCheckout }) => {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <HeadingText children="Payment Summary" level={2}/>
            <DividerLine/>
            <div className="flex justify-between">
                <p>Total Items <b>({totalItem})</b></p>
                <p className="font-bold">Rp. {totalPrice.toLocaleString(currencyFormat)}</p>
            </div>
            <DividerLine/>
            <ShippingSummaryCard shippingWeight={shippingWeight} shippingCost={shippingCost}/>
            {
                (totalDiscountProduct > 0 || totalDiscountVoucher > 0) && 
                    <div className="bg-green-200 rounded-lg p-3 my-2">
                        <HeadingText children="Discount" level={3}/>
                        {
                            totalDiscountProduct > 0 && (
                                <div className="flex justify-between">
                                    <p>From Product</p>
                                    <p className="font-bold">-Rp. {totalDiscountProduct.toLocaleString(currencyFormat)}</p>
                                </div>
                            )
                        }
                        {
                            totalDiscountVoucher > 0 && (
                                <div className="flex justify-between">
                                    <p>From Voucher</p>
                                    <p className="font-bold">-Rp. {totalDiscountVoucher.toLocaleString(currencyFormat)}</p>
                                </div>
                            )
                        }
                    </div>
            }
            <DividerLine/>
            <div className="flex justify-between">
                <HeadingText children="Final Price" level={3}/>
                <p className="font-bold text-xl">Rp. {finalPrice.toLocaleString(currencyFormat)}</p>
            </div>
            <DividerLine/>
            <div className="flex gap-5 w-full">
                <Button className="flex-1 h-10 bg-teal-700 hover:bg-[#00767a] text-white font-bold rounded-[8px] shadow-lg shadow-primary-teal/20 transition-all duration-300 active:scale-[0.97] disabled:opacity-70" onClick={onCheckout}>
                    <ArrowRightIcon/> Continue Payment
                </Button>
            </div>
        </div>
    )
}
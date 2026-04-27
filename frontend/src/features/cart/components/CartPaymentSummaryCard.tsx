import { Button } from "@/components/ui/button"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { ArrowRight } from "lucide-react"
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
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 mb-4">
            <h5 className="font-bold mb-3">Payment Summary</h5>
            <div className="flex justify-between">
                <p>Total Items <b>({totalItem})</b></p>
                <h6 className="font-bold">Rp. {totalPrice.toLocaleString()}</h6>
            </div>
            <div className="flex justify-between">
                <p>Shipping Cost</p>
                <h6 className="font-bold">Rp. {shippingCost.toLocaleString()}</h6>
            </div>
            <div className="flex justify-between">
                <p>Shipping Weight</p>
                <div className="flex items-center gap-2 relative group">
                    <h6 className="font-bold">{(shippingWeight / 1000).toFixed(2)} Kg</h6>
                    <InformationCircleIcon className="w-4 h-4 cursor-pointer"/>
                    <div className="absolute bg-teal-700 shadow-md shadow-primary right-0 top-full mt-2 w-64 rounded-lg bg-slate-800 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        This is your <b>cart's total weight</b>. For shipping and payment, carriers may round it up to <b>{Math.ceil(shippingWeight / 1000)} kg</b>.
                    </div>
                </div>
            </div>
            {
                (totalDiscountProduct > 0 || totalDiscountVoucher > 0) && 
                    <div className="bg-green-200 rounded-lg p-3 my-2">
                        <h6 className="font-bold">Discount</h6>
                        {
                            totalDiscountProduct > 0 && (
                                <div className="flex justify-between">
                                    <p>From Product</p>
                                    <h6 className="font-bold">-Rp. {totalDiscountProduct.toLocaleString()}</h6>
                                </div>
                            )
                        }
                        {
                            totalDiscountVoucher > 0 && (
                                <div className="flex justify-between">
                                    <p>From Voucher</p>
                                    <h6 className="font-bold">-Rp. {totalDiscountVoucher.toLocaleString()}</h6>
                                </div>
                            )
                        }
                    </div>
            }
            <hr className="my-3"/>
            <div className="flex justify-between">
                <h6 className="font-bold">Final Price</h6>
                <h4 className="font-bold text-xl">Rp. {finalPrice.toLocaleString()}</h4>
            </div>
            <hr className="mt-3 mb-5"/>
            <div className="flex gap-5 w-full">
                <Button className="flex-1 h-10 bg-teal-700 hover:bg-[#00767a] text-white font-bold rounded-[8px] shadow-lg shadow-primary-teal/20 transition-all duration-300 active:scale-[0.97] disabled:opacity-70" onClick={onCheckout}>
                    <ArrowRight/> Continue Payment
                </Button>
            </div>
        </div>
    )
}
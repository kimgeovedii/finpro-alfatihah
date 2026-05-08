import { PaymentData } from "@/types/payment.type"
import { OrderManagementTableOrderPlacedSection } from "./OrderMatchingTableOrderPlacedSection"
import { OrderManagementTableShippedSection } from "./OrderMatchingTableShippedSection"
import { AddressData, BranchData } from "@/types/address.type"
import { OrderMatchingProcessedSection } from "./OrderMatchingTableProcessedSection"
import { OrderManagementTableOrderDeliveredSection } from "./OrderMatchingTableOrderDelivered"
import { CopyFieldButton } from "@/components/button/CopyFieldButton"
import { HeadingText } from "@/components/layout/HeadingText"
import { ProductOrderCartItem } from "@/types/product.type"
import { ArchiveBoxIcon, CheckIcon, HomeIcon, TruckIcon, XMarkIcon } from "@heroicons/react/24/outline"

export type OrderMatchingItem = {
    id: string
    quantity: number
    price: number
    stockBefore: number
    stockAfter: number
    product: ProductOrderCartItem
}

type Props = {
    status?: string
    orderNumber: string
    items: OrderMatchingItem[]
    payments: PaymentData[]
    branch?: BranchData
    address?: AddressData
    confirmedAt?: string | null
    shippedAt?: string | null
    isLoading: boolean
    shippingCost: number 
    finalPrice: number
    distance?: number
    role: string
    onCancel: (orderNumber: string) => void
    onShipping: (orderNumber: string) => void
}

export const OrderMatchingTable: React.FC<Props> = ({ orderNumber, items, isLoading, payments, shippingCost, finalPrice, onShipping, onCancel, status, branch, address, distance, confirmedAt, shippedAt, role }) => {    
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full">
            <div className="flex items-center justify-between mb-5">
                <CopyFieldButton label="Order Number" value={orderNumber}/>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                            <CheckIcon className="w-4 h-4"/>
                        </div>
                        <div className="w-0.5 flex-1 my-1 min-h-[20px] bg-slate-200"/>
                    </div>
                    <div className="pb-4 w-full">
                        <HeadingText level={2} children="Order Placed" className={`${status !== "WAITING_PAYMENT_CONFIRMATION" && status !== "WAITING_PAYMENT" ? "text-emerald-600" : "text-gray-400"} mb-2`}/>
                        { !isLoading && payments[0] ? <OrderManagementTableOrderPlacedSection method={payments[0].method} status={payments[0].status} shippingCost={shippingCost} finalPrice={finalPrice}/> : <>Loading...</> }
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                            <ArchiveBoxIcon className="w-4 h-4"/>
                        </div>
                        <div className="w-0.5 flex-1 my-1 min-h-[20px] bg-slate-200"/>
                    </div>
                    <div className="pb-4 w-full">
                        <HeadingText level={2} children="Processed" className={`${
                            status && ["PROCESSING","SHIPPED","CONFIRMED","CANCELLED"].includes(status) ? "text-emerald-600" : "text-gray-400"} mb-2`}
                        />
                        <OrderMatchingProcessedSection branchName={branch?.storeName??'-'} items={items} status={status} isLoading={isLoading} onShipping={onShipping} onCancel={onCancel} orderNumber={orderNumber} role={role}/>
                    </div>
                </div>
                {
                    status !== "CANCELLED" ?
                        <>
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                                        <TruckIcon className="w-4 h-4"/>
                                    </div>
                                    <div className="w-0.5 flex-1 my-1 min-h-[20px] bg-slate-200"/>
                                </div>
                                <div className="pb-4 w-full">
                                    <HeadingText level={2} children="Shipped" className={`${status && ["SHIPPED","CONFIRMED"].includes(status) ? "text-emerald-600" : "text-gray-400"} mb-2`}/>
                                    {
                                        status === "SHIPPED" || status === "CONFIRMED" ?
                                            <OrderManagementTableShippedSection 
                                                branchCity={branch?.city ?? "-"}
                                                branchAddress={branch?.address ?? "-"}
                                                storeName={branch?.storeName ?? "-"}
                                                distance={distance ?? 0} 
                                                shippedAt={shippedAt ?? "-"} 
                                                labelCustomer={address?.label ?? "-"}
                                                addressCustomer={address?.address ?? "-"}
                                                phoneCustomer={address?.phone ?? "-"}
                                                receiptName={address?.receiptName ?? "-"}
                                            />
                                        : 
                                            <p className="text-xs text-slate-400">Order shipped</p>
                                    }
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                                        <HomeIcon className="w-4 h-4"/>
                                    </div>
                                </div>
                                <div className="pb-4 w-full">
                                    <HeadingText level={2} children="Delivered" className={`${status === "CONFIRMED" ? "text-emerald-600" : "text-gray-400"} mb-2`}/>
                                    { status === "CONFIRMED" ? <OrderManagementTableOrderDeliveredSection confirmedAt={confirmedAt}/> : <p className="text-xs text-slate-400">Order delivered</p> }
                                </div>
                            </div>
                        </>
                    :
                        <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-400 text-white">
                                    <XMarkIcon className="w-4 h-4"/>
                                </div>
                            </div>
                            <div className="pb-4 w-full">
                                <HeadingText level={2} children="Cancelled" className="text-red-400 mb-2"/>
                            </div>
                        </div>  
                }
                
            </div>
        </div>
    )
}
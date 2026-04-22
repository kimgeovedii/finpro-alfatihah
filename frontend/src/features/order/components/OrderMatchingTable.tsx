import { Check, Home, Package, Truck } from "lucide-react"
import { PaymentData } from "@/types/payment.type"
import { OrderManagementTableOrderPlacedSection } from "./OrderMatchingTableOrderPlacedSection"
import { OrderManagementTableShippedSection } from "./OrderMatchingTableShippedSection"
import { AddressData, BranchData } from "@/types/address.type"
import { OrderMatchingProcessedSection } from "./OrderMatchingTableProcessedSection"
import { OrderManagementTableOrderDeliveredSection } from "./OrderMatchingTableOrderDelivered"
import { CopyField } from "@/components/button/CopyField"

export type OrderMatchingProduct = {
    productName: string
    imageUrl?: string
}

export type OrderMatchingItem = {
    id: string
    quantity: number
    price: number
    stockBefore: number
    stockAfter: number
    product: OrderMatchingProduct
}

type Props = {
    status?: string
    orderNumber: string
    items: OrderMatchingItem[]
    payments: PaymentData[]
    branch?: BranchData
    address?: AddressData
    confirmedAt?: string | null
    isLoading: boolean
    shippingCost: number 
    finalPrice: number
    distance?: number
    onSearch?: (query: string) => void
    onCancel: (orderNumber: string) => void
    onShipping: (orderNumber: string) => void
}

export const OrderMatchingTable: React.FC<Props> = ({ orderNumber, items, isLoading, payments, onSearch, shippingCost, finalPrice, onShipping, onCancel, status, branch, address, distance, confirmedAt }) => {    
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full">
            <div className="flex items-center justify-between mb-5">
                <CopyField label="Order number" value={orderNumber}/>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                            <Check className="w-4 h-4"/>
                        </div>
                        <div className="w-0.5 flex-1 my-1 min-h-[20px] bg-slate-200"/>
                    </div>
                    <div className="pb-4 w-full">
                        <p className="text-sm font-semibold text-emerald-600 mb-2">Order Placed</p>
                        { !isLoading && payments[0] ? <OrderManagementTableOrderPlacedSection method={payments[0].method} status={payments[0].status} shippingCost={shippingCost} finalPrice={finalPrice}/> : <>Loading...</> }
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                            <Package className="w-4 h-4"/>
                        </div>
                        <div className="w-0.5 flex-1 my-1 min-h-[20px] bg-slate-200"/>
                    </div>
                    <div className="pb-4 w-full">
                        <p className="text-sm font-semibold text-emerald-600 mb-2">Processed</p>
                        <OrderMatchingProcessedSection items={items} status={status} isLoading={isLoading} onShipping={onShipping} onCancel={onCancel} onSearch={onSearch} orderNumber={orderNumber}/>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                            <Truck className="w-4 h-4"/>
                        </div>
                        <div className="w-0.5 flex-1 my-1 min-h-[20px] bg-slate-200"/>
                    </div>
                    <div className="pb-4 w-full">
                        <p className="text-sm font-semibold text-emerald-600 mb-2">Shipped</p>
                        {
                            status === "SHIPPED" || status === "CONFIRMED" ?
                                <OrderManagementTableShippedSection 
                                    branchCity={branch?.city ?? "-"}
                                    branchAddress={branch?.address ?? "-"}
                                    storeName={branch?.storeName ?? "-"}
                                    distance={distance ?? 0} 
                                    shippedAt={""} 
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
                            <Home className="w-4 h-4"/>
                        </div>
                    </div>
                    <div className="pb-4 w-full">
                        <p className="text-sm font-semibold text-emerald-600 mb-2">Delivered</p>
                        { status === "CONFIRMED" ? <OrderManagementTableOrderDeliveredSection confirmedAt={confirmedAt}/> : <p className="text-xs text-slate-400">Order delivered</p> }
                    </div>
                </div>
            </div>
        </div>
    )
}
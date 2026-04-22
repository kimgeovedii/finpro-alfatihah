import { CopyField } from "@/components/button/CopyField"
import { formatDate } from "@/utils/converter.util"
import { BuildingOfficeIcon } from "@heroicons/react/24/outline"
import { CalendarDays, Clock, MapPin } from "lucide-react"
import React from "react"

type BranchInfo = {
    name: string
    address: string
    schedule: string
    imageUrl?: string
}

type OrderInfo = {
    orderNumber: string
    orderStatus: string 
    paymentStatus: string
    paymentMethod: string
    createdAt?: string | null
    paymentDeadline?: string | null
}

type Props = {
    branch: BranchInfo
    orderInfo: OrderInfo
}

export const OrderDetailBranchCard: React.FC<Props> = ({ branch, orderInfo }) => {
    const getOrderStatusStyle = (status: string) => {
        switch (status) {
            case "WAITING_PAYMENT":
            case "WAITING_PAYMENT_CONFIRMATION":
                return "text-orange-600 bg-orange-100"
            case "PROCESSING":
            case "SHIPPED":
                return "text-blue-600 bg-blue-100"
            case "CONFIRMED":
                return "text-emerald-600 bg-emerald-100"
            case "CANCELLED":
                return "text-red-600 bg-red-100"
            default:
                return "text-slate-600 bg-slate-100"
        }
    }
    
    const getPaymentStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-orange-600 bg-orange-100"
            case "SUCCESS":
                return "text-emerald-600 bg-emerald-100"
            case "REJECTED":
                return "text-red-600 bg-red-100"
            default:
                return "text-slate-600 bg-slate-100"
        }
    }

    return (
        <div className="bg-white rounded-3xl">
            <div className="p-5 pb-0">
                <CopyField label="Order number" value={orderInfo.orderNumber} customClass="text-lg font-semibold"/>
                <hr className="my-4"/>
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-sm mb-0">Order Status</label>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${getOrderStatusStyle(orderInfo.orderStatus)}`}>{orderInfo.orderStatus.replaceAll("_"," ")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-sm">Payment Method</label>
                        <span className="inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{orderInfo.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-sm">Payment Status</label>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${getPaymentStatusStyle(orderInfo.paymentStatus)}`}>{orderInfo.paymentStatus}</span>
                    </div>
                </div>
                <hr className="mt-4"/>
            </div>
            <div className="flex flex-wrap gap-5 w-full p-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Created at</p>
                        <p className="text-sm font-semibold text-slate-700">{orderInfo.createdAt ? formatDate(orderInfo.createdAt, true) : <>-</>}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-1 justify-end text-end">
                    <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Payment Deadline</p>
                        <p className="text-sm font-semibold text-slate-700">{orderInfo.paymentDeadline ? formatDate(orderInfo.paymentDeadline, true) : <>-</>}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400">
                        <Clock className="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="relative rounded-b-3xl overflow-hidden p-6 flex flex-col gap-4" style={{ background: "linear-gradient(135deg, #0f6e56 0%, #085041 100%)" }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "12px 12px" }}/>
                    <div className="relative flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                            <BuildingOfficeIcon className="w-5 h-5"/>
                        </div>
                        <p className="text-white text-lg font-bold">{branch.name}</p>
                    </div>
                    <div className="relative flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-white/80 text-sm">
                        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                        <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                            <CalendarDays className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span>{branch.schedule}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
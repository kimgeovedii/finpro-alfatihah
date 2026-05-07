import { CopyFieldButton } from "@/components/button/CopyFieldButton"
import { BranchInfoCard } from "@/components/layout/BranchInfoCard"
import { DividerLine } from "@/components/layout/DividerLine"
import { BranchData } from "@/types/address.type"
import { formatDate } from "@/utils/converter.util"
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline"
import React from "react"

type OrderInfo = {
    orderNumber: string
    orderStatus: string 
    paymentStatus: string
    paymentMethod: string
    createdAt?: string | null
    paymentDeadline?: string | null
}

type Props = {
    branch: BranchData
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
        <div className="bg-white rounded-3xl border border-slate-200">
            <div className="p-5 pb-0">
                <CopyFieldButton label="Order number" value={orderInfo.orderNumber} customClass="text-lg font-semibold"/>
                <DividerLine/>
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-sm mb-0">Order Status</p>
                        <p className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${getOrderStatusStyle(orderInfo.orderStatus)}`}>{orderInfo.orderStatus.replaceAll("_"," ")}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm">Payment Method</p>
                        <p className="inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{orderInfo.paymentMethod}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm">Payment Status</p>
                        <p className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${getPaymentStatusStyle(orderInfo.paymentStatus)}`}>{orderInfo.paymentStatus}</p>
                    </div>
                </div>
                <DividerLine/>
            </div>
            <div className="flex flex-wrap gap-5 w-full px-4 pb-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <CalendarDaysIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Created at</p>
                        <p className="text-sm font-semibold text-slate-700">{orderInfo.createdAt ? formatDate(orderInfo.createdAt, true) : <>-</>}</p>
                    </div>
                </div>
                {
                    orderInfo.paymentStatus !== "SUCCESS" && 
                        <div className="flex items-center gap-3 flex-1 justify-end text-end">
                            <div>
                                <p className="text-sm text-slate-400">Payment Deadline</p>
                                <p className="text-sm font-semibold text-slate-700">{orderInfo.paymentDeadline ? formatDate(orderInfo.paymentDeadline, true) : <>-</>}</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-400">
                                <ClockIcon className="w-4 h-4" />
                            </div>
                        </div>
                }
            </div>
            <BranchInfoCard branch={branch} roundedClass="rounded-b-3xl"/>
        </div>
    )
}
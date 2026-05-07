'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { currencyFormat, OrderStatus, statusColorMap } from "@/constants/business.const"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/converter.util"
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { CopyFieldButton } from "@/components/button/CopyFieldButton"
import { PaymentData } from "@/types/payment.type"
import Link from "next/link"
import { PaginationMeta } from "@/types/global.type"
import { MessageBox } from "@/components/layout/MessageBox"
import { MiniTagBox } from "@/components/layout/MiniTagBox"
import { UserIcon } from "@heroicons/react/20/solid"
import { PaymentConfirmationDialog } from "./PaymentConfirmationDialog"

export type OrderTableItem = {
    id: string
    storeName: string
    orderNumber: string
    customerName: string
    customerEmail: string
    createdAt: string
    finalPrice: number
    status: OrderStatus
    payments: PaymentData[]
}

type Props = {
    orders: OrderTableItem[]
    meta: PaginationMeta | null
    activeStatus: string
    isLoading: boolean
    onPageChange: (page: number) => void
    onValidatePaymentEvidence: (paymentId: string, isConfirm: boolean) => void
}

export const OrderManagementTable: React.FC<Props> = ({ orders, meta, isLoading, activeStatus, onPageChange, onValidatePaymentEvidence }) => {
    // Pagination 
    const currentPage = meta?.page ?? 1
    const totalPages = meta?.totalPages ?? 1
    const totalOrders = meta?.total ?? 0
    const limit = meta?.limit ?? 10
    const startItem = (currentPage - 1) * limit + 1
    const endItem = Math.min(currentPage * limit, totalOrders)
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))

    return (
        <div className="w-full rounded-xl overflow-hidden border border-emerald-700">
            <div className="w-full overflow-x-auto">
                <Table className="min-w-[700px] table-center rounded-lg">
                    <TableHeader className="rounded-lg">
                        <TableRow className="bg-emerald-700 uppercase hover:bg-emerald-700">
                            <TableHead className="font-semibold text-white">Order Detail</TableHead>
                            <TableHead className="font-semibold text-white">Customer</TableHead>
                            <TableHead className="font-semibold text-white">Date</TableHead>
                            <TableHead className="font-semibold text-white">Total Price</TableHead>
                            <TableHead className="font-semibold text-white">Status</TableHead>
                            <TableHead className="font-semibold text-white">Payment</TableHead>
                            <TableHead className="font-semibold text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            isLoading ? (
                                // Render loading element
                                <TableRow>
                                    <TableCell colSpan={7} className="text-slate-400 py-10">Loading...</TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                // Render failed fetching condition
                                <TableRow>
                                    <TableCell colSpan={7} className="text-slate-400 py-10">
                                        <MessageBox context={'No orders found'} image={"/assets/empty.png"} description={`No <b>${activeStatus}</b> order / transaction found`}/>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map(dt => {
                                    // Color mapping
                                    const statusClass = statusColorMap[dt.status] || "bg-slate-400"
                                    const finalStatus = dt.status !== "WAITING_PAYMENT_CONFIRMATION" ? dt.status.replaceAll('_',' ') : "NEED CONFIRMATION"
                                    
                                    return (
                                        <TableRow key={dt.id} className="hover:bg-slate-50">
                                            <TableCell className="font-semibold text-slate-800 items-start flex flex-col">
                                                <Link href={`/${dt.storeName}`} className="cursor-pointer">
                                                    <MiniTagBox val={dt.storeName}/>
                                                </Link>
                                                <CopyFieldButton label="Order number" value={dt.orderNumber} customClass="text-sm font-semibold"/>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-slate-800 flex items-center gap-1">
                                                    <UserIcon className="h-4 w-4"/> {dt.customerName}
                                                </p>
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <EnvelopeIcon className="h-4 w-4"/> {dt.customerEmail}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-slate-600">{formatDate(dt.createdAt,true)}</TableCell>
                                            <TableCell className="text-slate-800 font-medium">Rp {dt.finalPrice.toLocaleString(currencyFormat)}</TableCell>
                                            <TableCell className="max-w-[140px]">
                                                <Badge className={`capitalize px-2 font-semibold whitespace-normal break-words text-center h-auto mx-auto block rounded-lg ${statusClass}`}>{finalStatus}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    dt.status !== "WAITING_PAYMENT" && dt.payments.length > 0 && dt.payments[0].method === "MANUAL" && dt.payments[0].evidence !== null ?        
                                                        <PaymentConfirmationDialog imageUrl={dt.payments[0].evidence ?? ""} finalPrice={dt.finalPrice} paymentId={dt.payments[0].id} status={dt.status} onValidatePaymentEvidence={onValidatePaymentEvidence}/>
                                                    : dt.status === "CANCELLED" || dt.status === "WAITING_PAYMENT" ? 
                                                        <>-</> 
                                                    : 
                                                        <div className="bg-green-100 text-green-600 rounded-lg w-8 h-8 p-[5px] mx-auto">
                                                            <CheckIcon className="w-5 h-5"/>
                                                        </div>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    dt.status !== "WAITING_PAYMENT" && dt.status !== "WAITING_PAYMENT_CONFIRMATION" ?
                                                        <Link href={`/dashboard/manage-order/${dt.orderNumber}`}>
                                                            <Button className="bg-teal-700 text-white font-semibold text-xs px-3"><ArrowRightIcon className="w-3 h-3"/> Manage</Button>
                                                        </Link>
                                                    :
                                                        <>-</>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="p-4 bg-emerald-700">
            {
                meta && 
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-white">Showing {startItem} to {endItem} of {totalOrders.toLocaleString(currencyFormat)} orders</p>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="h-8 w-8 p-0 border-0 bg-transparent text-white hover:bg-green-600 hover:text-white"><ChevronLeftIcon/></Button>
                            { 
                                pageNumbers.map((p) => 
                                    <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" onClick={() => onPageChange(p)} className={`h-8 w-8 p-0 border-0 bg-transparent text-white hover:bg-green-600 hover:text-white ${p === currentPage ? "bg-green-600 text-white" : ""}`}>
                                        {p}
                                    </Button>
                                ) 
                            }
                            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="h-8 w-8 p-0 border-0 bg-transparent text-white hover:bg-green-600 hover:text-white"><ChevronRightIcon/></Button>
                        </div>
                    </div>
            }
            </div>
        </div>
    )
}


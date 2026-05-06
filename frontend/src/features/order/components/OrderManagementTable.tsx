'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { currencyFormat, OrderStatus, statusColorMap } from "@/constants/business.const"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/converter.util"
import { ArrowRightIcon, BanknotesIcon, CheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { CopyFieldButton } from "@/components/button/CopyFieldButton"
import { PaymentData } from "@/types/payment.type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { PaginationMeta } from "@/types/global.type"
import { MessageBox } from "@/components/layout/MessageBox"
import { MiniTagBox } from "@/components/layout/MiniTagBox"
import { UserIcon } from "@heroicons/react/20/solid"

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
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 w-full">
            <div className="w-full overflow-x-auto max-w-[80vw] md:max-w-[87.5vw] lg:max-w-full">
                <Table className="min-w-[700px]">
                    <TableHeader>
                        <TableRow className="uppercase text-xs tracking-wider text-slate-400">
                            <TableHead className="font-semibold">Order Detail</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Total Price</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Payment</TableHead>
                            <TableHead className="font-semibold">Actions</TableHead>
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
                                            <TableCell className="font-semibold text-slate-800">
                                                <MiniTagBox val={dt.storeName}/>
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
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button className="bg-orange-400 text-white font-semibold text-xs px-3 mx-auto block">
                                                                    <BanknotesIcon className="w-5 h-5"/>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="w-full max-w-[700px] rounded-2xl">
                                                                <DialogHeader>
                                                                    <DialogTitle className="font-bold mb-3">Payment Evidence</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="flex flex-col mt-2 text-center">
                                                                    <Image src={dt.payments[0].evidence ?? ""} className="w-full mx-auto h-full mb-2 rounded-lg" alt={dt.payments[0].evidence ?? ""} width={100} height={100}/>
                                                                    <p className="mb-0">Transaction Amount</p>
                                                                    <p className="font-bold mb-4">Rp {dt.finalPrice.toLocaleString(currencyFormat)}</p>
                                                                    {
                                                                        dt.status === "WAITING_PAYMENT_CONFIRMATION" && 
                                                                            <>
                                                                                <Button className="w-full bg-green-100 text-green-500 border-1 border-green-500 hover:bg-green-500 hover:text-white cursor-pointer mb-2" onClick={(e) => onValidatePaymentEvidence(dt.payments[0].id, true)}>Confirm</Button>
                                                                                <Button className="w-full bg-red-100 text-red-500 border-1 border-red-500 hover:bg-red-500 hover:text-white cursor-pointer" onClick={(e) => onValidatePaymentEvidence(dt.payments[0].id, false)}>Reject</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
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
            {
                meta && 
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-400">Showing {startItem} to {endItem} of {totalOrders.toLocaleString(currencyFormat)} orders</p>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} className="h-8 w-8 p-0">‹</Button>
                            { pageNumbers.map((p) => <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" onClick={() => onPageChange(p)} className={`h-8 w-8 p-0 ${p === currentPage ? "bg-teal-700 border-teal-700 hover:bg-teal-800" : ""}`}>{p}</Button>) }
                            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} className="h-8 w-8 p-0">›</Button>
                        </div>
                    </div>
            }
        </div>
    )
}


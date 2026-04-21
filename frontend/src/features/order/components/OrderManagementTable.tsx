'use client'
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OrderStatus, statusColorMap } from "@/constants/business.const"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/utils/converter.util"
import { BanknotesIcon, CheckBadgeIcon, CheckIcon } from "@heroicons/react/24/outline"
import { CopyField } from "@/components/button/CopyField"
import { PaymentData } from "@/types/payment.type"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { PaginationMeta } from "@/types/global.type"
import { CheckCheck } from "lucide-react"

export type OrderTableItem = {
    id: string
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
    isLoading: boolean
    activeStatus: OrderStatus | "ALL"
    onPageChange: (page: number) => void
    onStatusChange: (status: OrderStatus | "ALL") => void
    onSearch?: (query: string) => void
    onValidatePaymentEvidence: (paymentId: string, isConfirm: boolean) => void
}

const STATUS_FILTERS: { label: string; value: OrderStatus | "ALL" }[] = [
    { label: "All Orders", value: "ALL" },
    { label: "Waiting Payment", value: "WAITING_PAYMENT" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" },
]

export const OrderManagementTable: React.FC<Props> = ({ orders, meta, isLoading, onPageChange, onSearch, activeStatus, onStatusChange, onValidatePaymentEvidence }) => {
    const [search, setSearch] = useState("")
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        onSearch?.(e.target.value)
    }

    // Filtering
    const filteredOrders = orders.filter((o) => {
        const matchStatus = activeStatus === "ALL" || o.status === activeStatus
        const matchSearch = search === "" || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase())
        
        return matchStatus && matchSearch
    })

    // Pagination 
    const currentPage = meta?.page ?? 1
    const totalPages = meta?.total_page ?? 1
    const totalOrders = meta?.total ?? 0
    const limit = meta?.limit ?? 10
    const startItem = (currentPage - 1) * limit + 1
    const endItem = Math.min(currentPage * limit, totalOrders)
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-800">Recent Transaction Flow</h2>
                <Input placeholder="Quick search..." value={search} onChange={handleSearchChange} className="w-52 h-9 text-sm"/>
            </div>
            <div className="flex gap-2 mb-5 flex-wrap">
                {
                    STATUS_FILTERS.map((f) => (
                        <Button key={f.value} onClick={() => onStatusChange(f.value)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                            activeStatus === f.value ? "bg-teal-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            {f.label}
                        </Button>
                    ))
                }
            </div>
            <Table className="table-center">
                <TableHeader>
                    <TableRow className="uppercase text-xs tracking-wider text-slate-400">
                        <TableHead className="font-semibold">Order ID</TableHead>
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
                            <TableRow>
                                <TableCell colSpan={6} className="text-slate-400 py-10">Loading...</TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-slate-400 py-10">No orders found</TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map(dt => {
                                // Color mapping
                                const statusClass = statusColorMap[dt.status] || "bg-slate-400"
                                const finalStatus = dt.status.replaceAll('_',' ')
                                
                                return (
                                    <TableRow key={dt.id} className="hover:bg-slate-50">
                                        <TableCell className="font-semibold text-slate-800">
                                            <CopyField label="Order number" value={dt.orderNumber} customClass="text-sm font-semibold"/>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-slate-800">{dt.customerName}</p>
                                            <p className="text-xs text-slate-400">{dt.customerEmail}</p>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{formatDate(dt.createdAt,true)}</TableCell>
                                        <TableCell className="text-slate-800 font-medium">Rp {dt.finalPrice.toLocaleString("id-ID")}</TableCell>
                                        <TableCell>
                                            <Badge className={`capitalize font-semibold ${statusClass}`}>{finalStatus}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                dt.status !== "WAITING_PAYMENT" && dt.payments.length > 0 && dt.payments[0].method === "MANUAL" && dt.payments[0].evidence !== null ?        
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button className="bg-transparent text-teal-700 font-semibold text-sm hover:underline border-teal-700 border-1 rounded-lg p-2 hover:bg-teal-700 hover:text-white cursor-pointer">
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
                                                                <p className="font-bold mb-4">Rp {dt.finalPrice.toLocaleString("id-ID")}</p>
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
                                                : dt.status === "CANCELLED" ? 
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
                                                    <Link href={`/manage-order/${dt.orderNumber}`}>
                                                        <Button className="bg-transparent text-teal-700 font-semibold text-sm hover:underline">Manage</Button>
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
            {
                meta && 
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-400">Showing {startItem} to {endItem} of {totalOrders.toLocaleString()} orders</p>
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

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArchiveBoxIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { OrderMatchingItem } from "./OrderMatchingTable"
import Image from "next/image"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { lowStockAlertLimit } from "@/constants/business.const"

type Props = {
    items: OrderMatchingItem[]
    status?: string
    isLoading: boolean
    onShipping: (orderNumber: string) => void
    onSearch?: (query: string) => void
    onCancel: (orderNumber: string) => void
    orderNumber: string
    branchName: string
}
  
export const OrderMatchingProcessedSection: React.FC<Props> = ({ branchName, items, status, isLoading, onShipping, onSearch, onCancel, orderNumber}) => {
    const [search, setSearch] = useState("")
    const filteredItems = items.filter(dt => search === "" || dt.product.productName.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="pb-4 w-full">
            <div className="border-1 rounded-lg p-4 shadow-md">
            <div className="flex flex-col gap-2 mb-4">
                <Label>Product Name</Label>
                <Input placeholder="e.g. Orange juice" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full md:w-[320px]"/>
            </div>
            <div className="rounded-xl overflow-hidden border border-emerald-700">
                <Table className="table-center rounded-lg">
                    <TableHeader className="rounded-lg">
                        <TableRow className="bg-emerald-700 uppercase hover:bg-emerald-700">
                            <TableHead className="font-semibold text-white">Ordered Product</TableHead>
                            <TableHead className="font-semibold text-white">Ordered Qty</TableHead>
                            {
                                status === "PROCESSING" && 
                                    <>
                                        <TableHead className="font-semibold text-white">Stock Before</TableHead>
                                        <TableHead className="font-semibold text-white">Status</TableHead>
                                        <TableHead className="font-semibold text-white">Stock After</TableHead>
                                    </>
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                                </TableRow>
                        ) : filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">No items found</TableCell>
                            </TableRow>
                        ) : (
                            filteredItems.map(dt => {
                                const matched = dt.stockBefore >= dt.quantity
                
                                return (
                                    <TableRow key={dt.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {
                                                        dt.product.imageUrl
                                                            ? <Image src={dt.product.imageUrl} alt={dt.product.imageUrl} className="w-full h-full object-cover" width={100} height={100}/>
                                                            : <span className="text-2xl">🛒</span>
                                                    }
                                                </div>
                                                <div className="text-start">
                                                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">{dt.product.category.name}</p>
                                                    <Link href={`/${branchName}/${dt.product.slugName}`}>
                                                        <p className="text-sm font-semibold text-slate-800 cursor-pointer hover:underline line-clamp-3">
                                                            {dt.product.productName}
                                                        </p>
                                                    </Link>
                                                    {
                                                        dt.stockAfter < lowStockAlertLimit &&
                                                            <div className="flex">
                                                                <span className="mt-1 text-xs text-orange-500 font-semibold bg-orange-100 px-2 py-1 rounded-md flex gap-1">
                                                                    <ExclamationCircleIcon className="w-4 h-4"/> Low stock
                                                                </span>
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{dt.quantity}</TableCell>
                                        {
                                            status === "PROCESSING" && 
                                                <>
                                                    <TableCell>{dt.stockBefore}</TableCell>
                                                    <TableCell>
                                                        <Badge className={matched ? "bg-emerald-100 text-emerald-500" : "bg-red-100 text-red-500"}>
                                                            {matched ? "Matched" : "Insufficient"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{dt.stockAfter}</TableCell>
                                                </>
                                        }
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            {
                status && ["SHIPPED", "CANCELLED", "CONFIRMED"].includes(status) ?
                    <div className={`w-full bg-${status === "SHIPPED" || status === "CONFIRMED" ? 'green' : 'red'}-100 text-${status === "SHIPPED" || status === "CONFIRMED" ? 'green' : 'red'}-500 p-3 rounded-lg my-2 font-bold text-md text-center`}>{status}!</div>
                :
                    <div className="mt-5 flex gap-2">
                        <Button className="flex-1 bg-red-400 hover:bg-red-500 hover:shadow" onClick={(e) => onCancel(orderNumber)}><XMarkIcon/> Cancel Order!</Button>
                        <Button className="flex-1 bg-teal-700 hover:shadow" onClick={(e) => onShipping(orderNumber)}><ArchiveBoxIcon/> Shipping Now!</Button>
                    </div>
            }
            </div>
        </div>
    )
}
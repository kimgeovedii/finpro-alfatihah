import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArchiveBoxIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { OrderMatchingItem } from "./OrderMatchingTable"
import Image from "next/image"
import Link from "next/link"

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
            <Input placeholder="e.g. ORD-123" value={search} onChange={(e) => setSearch(e.target.value)} className="w-52 h-9 text-sm"/>
            <Table className="table-center">
                <TableHeader>
                    <TableRow className="uppercase text-xs tracking-wider text-slate-400">
                        <TableHead className="font-semibold">Ordered Product</TableHead>
                        <TableHead className="font-semibold">Ordered Qty</TableHead>
                        {
                            status === "PROCESSING" && 
                                <>
                                    <TableHead className="font-semibold">Stock Before</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Stock After</TableHead>
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
            {
                status && ["SHIPPED", "CANCELLED", "CONFIRMED"].includes(status) ?
                    <div className={`w-full bg-${status === "SHIPPED" || status === "CONFIRMED" ? 'green' : 'red'}-100 text-${status === "SHIPPED" || status === "CONFIRMED" ? 'green' : 'red'}-500 p-3 rounded-lg my-2 font-bold text-md text-center`}>{status}!</div>
                :
                    <div className="mt-5 flex gap-2">
                        <Button className="flex-1 py-5 bg-emerald-400 hover:bg-emerald-500 hover:shadow" onClick={(e) => onShipping(orderNumber)}><ArchiveBoxIcon/> Shipping Now!</Button>
                        <Button className="flex-1 py-5 bg-red-400 hover:bg-red-500 hover:shadow" onClick={(e) => onCancel(orderNumber)}><XMarkIcon/> Cancel Order!</Button>
                    </div>
            }
            </div>
        </div>
    )
}
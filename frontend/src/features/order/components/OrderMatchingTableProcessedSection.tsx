import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArchiveBoxIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { OrderMatchingItem } from "./OrderMatchingTable"

type Props = {
    items: OrderMatchingItem[]
    status?: string
    isLoading: boolean
    onShipping: (orderNumber: string) => void
    onSearch?: (query: string) => void
    orderNumber: string
}
  
export const OrderMatchingProcessedSection: React.FC<Props> = ({ items, status, isLoading, onShipping, onSearch, orderNumber}) => {
    const [search, setSearch] = useState("")
    const filteredItems = items.filter(item =>
        search === "" ||
        item.product.productName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="pb-4 w-full">
            <p className="text-sm font-semibold text-emerald-600 mb-2">Processed</p>
            <div className="border-1 rounded-lg p-4 shadow-md">
            <Input placeholder="Quick search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-52 h-9 text-sm"/>
            <Table className="table-center">
                <TableHeader>
                    <TableRow className="uppercase text-xs tracking-wider text-slate-400">
                        <TableHead>Requested Product</TableHead>
                        <TableHead>Requested Qty</TableHead>
                        {
                            status === "PROCESSING" && 
                                <>
                                    <TableHead>Stock Before</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Stock After</TableHead>
                                </>
                        }
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
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
                        filteredItems.map(item => {
                        const matched = item.stockBefore >= item.quantity
        
                        return (
                            <TableRow key={item.id}>
                                <TableCell>{item.product.productName}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                {
                                    status === "PROCESSING" && 
                                        <>
                                            <TableCell>{item.stockBefore}</TableCell>
                                            <TableCell>
                                                <Badge className={matched ? "bg-teal-100 text-teal-500" : "bg-red-100 text-red-500"}>
                                                    {matched ? "Matched" : "Insufficient"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{item.stockAfter}</TableCell>
                                        </>
                                }
                                <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                                <TableCell>Rp {(item.price * item.quantity).toLocaleString()}</TableCell>
                            </TableRow>
                        )
                        })
                    )}
                </TableBody>
            </Table>
            {
                status === "SHIPPED" ?
                    <div className="w-full bg-green-100 text-green-500 p-4 rounded-lg my-2 font-bold text-md text-center">Shipped!</div>
                :
                    <Button className="mt-5 w-full py-5 bg-emerald-600" onClick={(e) => onShipping(orderNumber)}><ArchiveBoxIcon/> Shipping Now!</Button>
            }
            </div>
        </div>
    )
}
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PaginationMeta } from "@/types/global.type"

type OrderMatchingProduct = {
    productName: string
    imageUrl?: string
}

type OrderMatchingItem = {
    id: string
    quantity: number
    price: number
    stockBefore: number
    stockAfter: number
    product: OrderMatchingProduct
}

type Props = {
    orderNumber: string
    items: OrderMatchingItem[]
    meta: PaginationMeta
    isLoading: boolean
    onPageChange: (page: number) => void
    onSearch?: (query: string) => void
}

export const OrderMatchingTable: React.FC<Props> = ({ orderNumber, items, meta, isLoading, onPageChange, onSearch }) => {
    const [search, setSearch] = useState("")

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        onSearch?.(e.target.value)
    }

    const filteredItems = items.filter((item) =>
        search === "" || item.product.productName.toLowerCase().includes(search.toLowerCase())
    )

    const currentPage = meta?.page ?? 1
    const totalPages = meta?.total_page ?? 1
    const totalItems = meta?.total ?? 0
    const limit = meta?.limit ?? 10
    const startItem = (currentPage - 1) * limit + 1
    const endItem = Math.min(currentPage * limit, totalItems)
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-800">#{orderNumber}</h2>
                <Input placeholder="Quick search..." value={search} onChange={handleSearchChange} className="w-52 h-9 text-sm"/>
            </div>
            <Table className="table-center">
                <TableHeader>
                    <TableRow className="uppercase text-xs tracking-wider text-slate-400">
                        <TableHead className="font-semibold">Requested Product</TableHead>
                        <TableHead className="font-semibold">Requested Qty</TableHead>
                        <TableHead className="font-semibold">Stock Before</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Stock After</TableHead>
                        <TableHead className="font-semibold">Price Per Item</TableHead>
                        <TableHead className="font-semibold">Total Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                    isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-slate-400 py-10 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-slate-400 py-10 text-center">No items found</TableCell>
                            </TableRow>
                        ) : (
                            filteredItems.map((item) => {
                                const matched = item.stockBefore >= item.quantity
                                
                                return (
                                    <TableRow key={item.id} className="hover:bg-slate-50">
                                        <TableCell className="font-semibold text-slate-800">{item.product.productName}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.stockBefore}</TableCell>
                                        <TableCell>
                                            <Badge className={matched ? "bg-teal-600" : "bg-red-500"}>
                                                {matched ? "Matched" : "Insufficient"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.stockAfter}</TableCell>
                                        <TableCell>Rp {item.price.toLocaleString("id-ID")}</TableCell>
                                        <TableCell>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</TableCell>
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
                        <p className="text-sm text-slate-400">Showing {startItem} to {endItem} of {totalItems.toLocaleString()} orders</p>
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
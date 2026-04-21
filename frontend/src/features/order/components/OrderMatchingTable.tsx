import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, Home, Package, Truck } from "lucide-react"
import { PaymentData } from "@/types/payment.type"

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
    payments: PaymentData[]
    isLoading: boolean
    shippingCost: number 
    finalPrice: number
    onSearch?: (query: string) => void
}

export const OrderMatchingTable: React.FC<Props> = ({ orderNumber, items, isLoading, payments, onSearch, shippingCost, finalPrice }) => {
    const [search, setSearch] = useState("")

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        onSearch?.(e.target.value)
    }
    
    const filteredItems = items.filter((item) => search === "" || item.product.productName.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-800">#{orderNumber}</h2>
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
                        {
                            !isLoading && payments[0] ?
                                <div className="border-1 rounded-lg p-4 shadow-md w-full">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex justify-between">
                                            <p className="text-sm">Payment Method</p>
                                            <p className="text-xs font-bold">{payments[0].method}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm">Payment Status</p>
                                            <p className={`text-xs font-bold px-2 py-1 rounded-lg ${payments[0].status === "REJECTED" ? 'bg-red-100 text-red-500' : payments[0].status === "PENDING" ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-500'}`}>{payments[0].status}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm">Shipping Cost</p>
                                            <p className="text-sm font-bold">Rp. {shippingCost.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <hr className="my-3"/>
                                    <div className="flex justify-between">
                                        <p className="font-bold text-lg">Final Price</p>
                                        <p className="font-bold text-lg">Rp. {finalPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            :
                                <>Loading...</>
                        }
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
                        <div className="border-1 rounded-lg p-4 shadow-md">
                            <Input placeholder="Quick search..." value={search} onChange={handleSearchChange} className="w-52 h-9 text-sm"/>
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
                                                            <Badge className={matched ? "bg-teal-100 text-teal-500" : "bg-red-100 text-red-500"}>
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
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                            <Truck className="w-4 h-4"/>
                        </div>
                        <div className="w-0.5 flex-1 my-1 min-h-[20px] bg-slate-200"/>
                    </div>
                    <div className="pb-4">
                        <p className="text-sm font-semibold text-emerald-600">Shipped</p>
                        <p className="text-xs text-slate-400">On the way</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-600 text-white">
                            <Home className="w-4 h-4"/>
                        </div>
                    </div>
                    <div className="pb-4">
                        <p className="text-sm font-semibold text-emerald-600">Delivered</p>
                        <p className="text-xs text-slate-400">Order completed</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
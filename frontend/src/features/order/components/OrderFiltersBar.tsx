import { OrderStatus } from "@/constants/business.const"
import { BranchData } from "../repositories/branch.type"
import { Input } from "@/components/ui/input"
import { OrderBranchSelect } from "./OrderBranchSelect"
import { Button } from "@/components/ui/button"

type Props = {
    branchId: string
    branches: BranchData[]
    isBranchLoading: boolean
    activeStatus: OrderStatus | "ALL"
    search: string

    onStatusChange: (status: OrderStatus | "ALL") => void
    onBranchChange: (id: string) => void
    onSearchChange: (val: string) => void
}

const STATUS_FILTERS: { label: string; value: OrderStatus | "ALL" }[] = [
    { label: "All Orders", value: "ALL" },
    { label: "Waiting Payment", value: "WAITING_PAYMENT" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" },
]

export const OrderFiltersBar: React.FC<Props> = ({ branchId, branches, isBranchLoading, activeStatus, search, onSearchChange, onStatusChange, onBranchChange }) => {
    return (
        <>
            <div className="flex justify-between items-center my-3">
                <Input placeholder="e.g. ORD-123" value={search} onChange={(e) => onSearchChange(e.target.value)} className="w-52 h-9 text-sm w-full md:w-[300px] bg-white rounded-xl"/>
                <OrderBranchSelect
                    branches={branches}
                    value={branchId}
                    onValueChange={onBranchChange}
                    isLoading={isBranchLoading}
                />
            </div>
            <div className="flex gap-2 mb-5 flex-wrap">
                {
                    STATUS_FILTERS.map((dt) => (
                        <Button key={dt.value} onClick={() => onStatusChange(dt.value)} className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${activeStatus === dt.value ? "bg-teal-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            {dt.label}
                        </Button>
                    ))
                }
            </div>
        </>
    )
}
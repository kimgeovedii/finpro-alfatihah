import { OrderStatus } from "@/constants/business.const"
import { BranchData } from "../repositories/branch.type"
import { Input } from "@/components/ui/input"
import { OrderBranchSelect } from "./OrderBranchSelect"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { statusFilter } from "@/constants/feature.const"

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

export const OrderFiltersBar: React.FC<Props> = ({ branchId, branches, isBranchLoading, activeStatus, search, onSearchChange, onStatusChange, onBranchChange }) => {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-5 bg-white p-4 rounded-xl justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-3 w-full lg:w-auto">
                <div className="flex flex-col gap-2">
                    <Label>Search By Order Number</Label>
                    <Input placeholder="e.g. ORD-123" value={search} onChange={(e) => onSearchChange(e.target.value)} className="w-52 h-9 text-sm w-full lg:w-[300px] bg-white rounded-xl"/>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <Label>Filter By Branch</Label>
                    <OrderBranchSelect
                        branches={branches}
                        value={branchId}
                        onValueChange={onBranchChange}
                        isLoading={isBranchLoading}
                    />
                </div>
            </div>
            <div>
                <Label>Filter By Status</Label>
                <div className="flex gap-2 flex-wrap items-center mt-2">
                    {
                        statusFilter.map((dt) => (
                            <Button key={dt.value} onClick={() => onStatusChange(dt.value)} className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${activeStatus === dt.value ? "bg-teal-700 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                                {dt.label}
                            </Button>
                        ))
                    }
                </div>
            </div>
            
        </div>
    )
}
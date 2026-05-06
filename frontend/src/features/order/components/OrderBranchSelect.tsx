'use client'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { BranchData } from "../repositories/branch.type"
import { BuildingOfficeIcon } from "@heroicons/react/24/outline"

interface OrderBranchSelectProps {
    branches: BranchData[]
    value: string
    isLoading?: boolean
    disabled?: boolean
    className?: string

    onValueChange: (branchId: string) => void
}

export function OrderBranchSelect({ branches, value, onValueChange, isLoading = false, disabled = false, className }: OrderBranchSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
            <SelectTrigger className={cn("w-full lg:w-auto bg-white border-slate-200 text-slate-800 hover:border-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors duration-150 rounded-xl ", (disabled || isLoading) && "opacity-50 cursor-not-allowed", className)}>
                <div className="flex items-center gap-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-slate-400 shrink-0" />
                    <SelectValue placeholder={isLoading ? "Loading branches..." : "Select branch"} />
                </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 shadow-lg">
                <SelectGroup>
                    <SelectLabel className="text-xs text-slate-400 font-medium uppercase tracking-wider px-2 py-1.5">Branches</SelectLabel>
                    <SelectItem value={"ALL"} className="cursor-pointer text-slate-700 rounded-xl focus:bg-emerald-50 focus:text-emerald-800 data-[state=checked]:text-emerald-700 data-[state=checked]:font-medium">
                        <div className="flex flex-col text-start">
                            <span>All Branch</span>
                        </div>
                    </SelectItem>
                    {
                        branches.length === 0 ? 
                            <div className="px-2 py-4 text-sm text-slate-400 text-start">No branches available</div>
                        : 
                            branches.map((dt) => (
                                <SelectItem key={dt.id} value={dt.id} className="cursor-pointer text-slate-700 rounded-xl focus:bg-emerald-50 focus:text-emerald-800 data-[state=checked]:text-emerald-700 data-[state=checked]:font-medium">
                                    <div className="flex flex-col text-start">
                                        <span>{dt.storeName}</span>
                                        {dt.city && <span className="text-xs text-slate-400">{dt.city}</span>}
                                    </div>
                                </SelectItem>
                            ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

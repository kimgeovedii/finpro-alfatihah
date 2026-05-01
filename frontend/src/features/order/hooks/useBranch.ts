import { useEffect, useState } from "react"
import { branchRepository } from "../repositories/branch.repository"
import { PaginationMeta } from "@/types/global.type"
import { BranchData } from "../repositories/branch.type"

export const useAllBranchData = () => {
    const [branchs, setBranchs] = useState<BranchData[]>([])
    const [meta, setMeta] = useState<PaginationMeta | null>(null)
    const [isBranchLoading, setIsLoading] = useState(false)
    
    const fetchAllBranches = async (page = 1) => {
        setIsLoading(true)
    
        try {
            const res = await branchRepository.getAllBranches(page)
    
            setBranchs((prev) => page === 1 ? res.data : [...prev, ...res.data])
            setMeta(res.meta)
        } catch (err) {
            console.error("Failed to fetch branches", err)
        } finally {
            setIsLoading(false)
        }
    }
  
    useEffect(() => {
        fetchAllBranches(1)
    }, [])
  
    return { branchs, meta, isBranchLoading, fetchAllBranches }
}
import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useBranchStore } from "../service/branch.service";

export const useBranchDetail = () => {
  const { id } = useParams();
  const { detail, isLoading, error, fetchBranchDetail, reset } = useBranchStore();

  const loadDetail = useCallback((page?: number) => {
    if (id) {
      fetchBranchDetail(id as string, page);
    }
  }, [id, fetchBranchDetail]);

  useEffect(() => {
    loadDetail();
    return () => reset(); // Clean up on unmount
  }, [loadDetail, reset]);

  return {
    branch: detail?.branch || null,
    products: detail?.products || null,
    isLoading,
    error,
    loadDetail,
  };
};

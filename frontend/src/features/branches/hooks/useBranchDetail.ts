import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useBranchStore } from "../service/branch.service";

export const useBranchDetail = () => {
  const params = useParams();
  const branchIdentifier = params["store-name"] || params.slug || params.id;
  const { detail, isLoading, error, fetchBranchDetail, reset } = useBranchStore();

  const loadDetail = useCallback((page?: number) => {
    if (branchIdentifier) {
      fetchBranchDetail(branchIdentifier as string, page);
    }
  }, [branchIdentifier, fetchBranchDetail]);

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

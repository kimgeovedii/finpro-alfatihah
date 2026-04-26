"use client";

import { useBranchDetail } from "../hooks/useBranchDetail";
import { BranchHero } from "./BranchHero";
import { BranchSidebar } from "./BranchSidebar";
import { BranchProductGrid } from "./BranchProductGrid";
import { BranchLoading, BranchError } from "./BranchDetailStates";

export const BranchDetailPage = () => {
  const { branch, products, isLoading, error, loadDetail } = useBranchDetail();

  if (isLoading) return <BranchLoading />;
  if (error || !branch || !products) return <BranchError error={error} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <BranchHero branch={branch} totalProducts={products.meta.total} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <BranchSidebar branch={branch} />
          <BranchProductGrid 
            products={products.data} 
            meta={products.meta} 
            onPageChange={loadDetail}
          />
        </div>
      </div>
    </div>
  );
};

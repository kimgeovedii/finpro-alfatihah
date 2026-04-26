"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DiscountTablePaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const DiscountTablePagination: React.FC<DiscountTablePaginationProps> = ({
  meta,
  onPageChange,
}) => {
  const { page, totalPages, total, limit } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const startP = Math.max(2, page - 1);
      const endP = Math.min(totalPages - 1, page + 1);
      for (let i = startP; i <= endP; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  if (total === 0) return null;

  return (
    <div className="px-6 py-4 border-t border-[#eff1f2] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white mt-4 rounded-b-3xl">
      <p className="text-sm text-[#595c5d]">
        Showing {start} to {end} of {total} results
      </p>

      <div className="flex gap-1.5">
        <button
          id="pagination-prev"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2.5 py-1.5 rounded-lg border border-[#abadae]/30 text-[#595c5d] hover:bg-[#eff1f2] disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-[#595c5d] text-sm">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? "bg-[#006666] text-white"
                  : "text-[#595c5d] hover:bg-[#eff1f2]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          id="pagination-next"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-2.5 py-1.5 rounded-lg border border-[#abadae]/30 text-[#595c5d] hover:bg-[#eff1f2] disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

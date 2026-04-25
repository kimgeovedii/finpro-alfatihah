"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useManageStock } from "../hooks/useManageStock";
import { StockHeader } from "./StockHeader";
import { StockTable } from "./StockTable";
import { MobileStockCard } from "./MobileStockCard";
import { UpdateStockDialog } from "./UpdateStockDialog";
import { StockJournalDialog } from "./StockJournalDialog";
import { ProductTablePagination } from "@/features/manageProducts/components/ProductTablePagination";

export const StockManagementPage: React.FC = () => {
  const {
    inventory,
    branches,
    allProducts,
    journals,
    meta,
    isLoading,
    isJournalLoading,
    searchQuery,
    selectedBranchId,
    updateStockOpen,
    journalOpen,
    selectedItem,
    isSubmitting,

    handleSearchChange,
    setSelectedBranchId,
    handlePageChange,
    handleUpdateClick,
    handleViewJournal,
    handleUpdateSubmit,
    setUpdateStockOpen,
    setJournalOpen,
    setSelectedItem,
  } = useManageStock();

  const handleGlobalUpdateClick = () => {
    setSelectedItem(null);
    setUpdateStockOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <StockHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedBranchId={selectedBranchId}
        onBranchChange={setSelectedBranchId}
        branches={branches}
        onAddClick={handleGlobalUpdateClick}
      />

      {/* Desktop View */}
      <div className="hidden lg:block">
        <StockTable
          inventory={inventory}
          isLoading={isLoading}
          onUpdateStock={handleUpdateClick}
          onViewJournal={handleViewJournal}
        />
        <div className="mt-6 flex justify-end">
          <ProductTablePagination meta={meta} onPageChange={handlePageChange} />
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-white rounded-xl animate-pulse shadow-sm border border-[#eff1f2]"
            />
          ))
        ) : inventory.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#eff1f2]">
            <p className="text-[#595c5d] font-medium">
              No inventory results found.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {inventory.map((item, index) => (
              <MobileStockCard
                key={item.id}
                item={item}
                index={index}
                onUpdateStock={handleUpdateClick}
                onViewJournal={handleViewJournal}
              />
            ))}
          </AnimatePresence>
        )}
        <div className="mt-6">
          <ProductTablePagination meta={meta} onPageChange={handlePageChange} />
        </div>
      </div>

      <UpdateStockDialog
        open={updateStockOpen}
        onOpenChange={setUpdateStockOpen}
        inventoryItem={selectedItem}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isSubmitting}
        branches={branches}
        allProducts={allProducts}
      />

      <StockJournalDialog
        open={journalOpen}
        onOpenChange={setJournalOpen}
        inventoryItem={selectedItem}
        journals={journals}
        isLoading={isJournalLoading}
      />
    </motion.div>
  );
};

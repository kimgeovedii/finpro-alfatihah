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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

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
    selectedStockStatus,
    updateStockOpen,
    journalOpen,
    selectedItem,
    isSubmitting,
    isStoreAdmin,
    user,
    sortBy,
    sortOrder,

    handleSearchChange,
    setSelectedBranchId,
    setSelectedStockStatus,
    handlePageChange,
    handleSort,
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

  if (!isMounted) return null;

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
        selectedStockStatus={selectedStockStatus}
        onStatusChange={setSelectedStockStatus}
        branches={branches}
        onAddClick={handleGlobalUpdateClick}
        isStoreAdmin={isStoreAdmin}
      />

      {/* Desktop View */}
      <div className="hidden md:block shadow-[0_4px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white overflow-hidden">
        <StockTable
          inventory={inventory}
          isLoading={isLoading}
          onUpdateStock={handleUpdateClick}
          onViewJournal={handleViewJournal}
          isStoreAdmin={isStoreAdmin}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
        <ProductTablePagination meta={meta} onPageChange={handlePageChange} />
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
        <ProductTablePagination meta={meta} onPageChange={handlePageChange} />
      </div>

      <UpdateStockDialog
        open={updateStockOpen}
        onOpenChange={setUpdateStockOpen}
        inventoryItem={selectedItem}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isSubmitting}
        branches={branches}
        allProducts={allProducts}
        isStoreAdmin={isStoreAdmin}
        userBranchId={user?.employee?.branchId}
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

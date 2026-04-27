"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiscountTable } from "./DiscountTable";
import { CreateDiscountDialog } from "./CreateDiscountDialog";
import { EditDiscountDialog } from "./EditDiscountDialog";
import { DeleteDiscountDialog } from "./DeleteDiscountDialog";
import { useManageDiscounts } from "../hooks/useManageDiscounts";
import { DiscountHeader } from "./DiscountHeader";
import { DiscountTablePagination } from "./DiscountTablePagination";

export const DiscountManagementPage = () => {
  const {
    discounts,
    isLoading,
    isSubmitting,
    createDialogOpen,
    setCreateDialogOpen,
    handleCreateSubmit,
    handleDelete,
    selectedDiscount,
    setSelectedDiscount,
    discountToDelete,
    setDiscountToDelete,
    confirmDelete,
    handleUpdateSubmit,
    meta,
    handlePageChange,
    searchQuery,
    handleSearchChange,
  } = useManageDiscounts();

  const [activeTab, setActiveTab] = useState("All");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 min-w-0 w-full max-w-full"
    >
      <DiscountHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={() => setCreateDialogOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="w-full max-w-full relative shadow-[0_4px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key="table-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-full"
            >
              <DiscountTable 
                discounts={discounts} 
                onEdit={(d) => setSelectedDiscount(d)} 
                onDelete={handleDelete} 
              />
              <DiscountTablePagination 
                meta={meta} 
                onPageChange={handlePageChange} 
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <CreateDiscountDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
      />

      <EditDiscountDialog
        open={!!selectedDiscount}
        onOpenChange={(open) => !open && setSelectedDiscount(null)}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isSubmitting}
        discount={selectedDiscount}
      />

      <DeleteDiscountDialog
        open={!!discountToDelete}
        onOpenChange={(open) => !open && setDiscountToDelete(null)}
        discount={discountToDelete}
        onConfirm={confirmDelete}
        isDeleting={isLoading}
      />
    </motion.div>
  );
};

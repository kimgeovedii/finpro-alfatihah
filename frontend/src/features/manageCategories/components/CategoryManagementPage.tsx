"use client";

import React from "react";
import { motion } from "framer-motion";
import { useManageCategories } from "@/features/manageCategories/hooks/useManageCategories";
import { CategoryHeader } from "./CategoryHeader";
import { CategoryTable } from "./CategoryTable";
import { CategoryDialog } from "./CategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { ProductTablePagination } from "@/features/manageProducts/components/ProductTablePagination";

export const CategoryManagementPage: React.FC = () => {
  const {
    categories,
    meta,
    isLoading,
    searchQuery,
    sortBy,
    sortOrder,
    handleSort,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedCategory,
    isSubmitting,
    isDeleting,
    handleSearchChange,
    handlePageChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleCreate,
    handleUpdate,
    handleDeleteConfirm,
    canManage,
    userLoading,
  } = useManageCategories();

  if (userLoading && !canManage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666]"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <CategoryHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleAddClick}
        canManage={canManage}
      />

      <div className="shadow-[0_4px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white overflow-hidden border border-[#eff1f2]">
        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          canManage={canManage}
        />
        
        <ProductTablePagination 
          meta={meta} 
          onPageChange={handlePageChange} 
        />
      </div>

      <CategoryDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        title="Add New Category"
      />

      {selectedCategory && (
        <>
          <CategoryDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            category={selectedCategory}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            title="Edit Category"
          />
          <DeleteCategoryDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            category={selectedCategory}
            onConfirm={handleDeleteConfirm}
            isDeleting={isDeleting}
          />
        </>
      )}
    </motion.div>
  );
};

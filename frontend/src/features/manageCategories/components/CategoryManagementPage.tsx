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
  } = useManageCategories();

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
      />

      <div className="space-y-4">
        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
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

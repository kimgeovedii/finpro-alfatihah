"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useManageProducts } from "@/features/manageProducts/hooks/useManageProducts";
import { useUser } from "@/features/auth/hooks/useUser";
import { AuthenticatedUser } from "@/features/manageProducts/types/manageProduct.type";
import { ProductHeader } from "./ProductHeader";
import { ProductTable } from "./ProductTable";
import { ProductTablePagination } from "./ProductTablePagination";
import { MobileProductCard } from "./MobileProductCard";
import { AddProductDialog } from "./AddProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export const ProductManagementPage: React.FC = () => {
  const {
    products,
    meta,
    categories,
    isLoading,
    searchQuery,
    selectedCategory,
    sortBy,
    sortOrder,
    addDialogOpen,
    setAddDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedProduct,
    selectedEditingProduct,
    isSubmitting,
    isDeleting,
    isUpdating,
    handleSearchChange,
    handleCategoryChange,
    handleSort,
    handlePageChange,
    handleAddClick,
    handleCreate,
    handleEditClick,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
  } = useManageProducts();

  const { user } = useUser();
  const authUser = user as AuthenticatedUser;
  const canManage = authUser?.employee?.role === "SUPER_ADMIN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ProductHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddClick={handleAddClick}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        canManage={canManage}
      />

      <div className="hidden md:block">
        <ProductTable
          products={products}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          canManage={canManage}
        />
        <ProductTablePagination meta={meta} onPageChange={handlePageChange} />
      </div>

      <div className="md:hidden space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-4 flex gap-4 animate-pulse"
            >
              <div className="w-16 h-16 rounded-lg bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="w-3/4 h-4 bg-slate-200 rounded" />
                <div className="w-1/2 h-3 bg-slate-100 rounded" />
                <div className="w-1/3 h-3 bg-slate-100 rounded" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-8 text-center"
          >
            <p className="font-medium text-[#2c2f30]">No products found</p>
            <p className="text-sm text-[#595c5d] mt-1">
              Try adjusting your search or add a new product.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <MobileProductCard
                key={product.id}
                product={product}
                index={index}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                canManage={canManage}
              />
            ))}
          </AnimatePresence>
        )}

        <ProductTablePagination meta={meta} onPageChange={handlePageChange} />
      </div>
      <AddProductDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        categories={categories}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={selectedProduct}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {selectedEditingProduct && (
        <EditProductDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          categories={categories}
          product={selectedEditingProduct}
          onSubmit={handleUpdate}
          isUpdating={isUpdating}
        />
      )}
    </motion.div>
  );
};

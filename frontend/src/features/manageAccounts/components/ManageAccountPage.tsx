"use client";

import { motion } from "framer-motion";
import { useManageAccount } from "../hooks/useManageAccount";
import { AccountHeader } from "./AccountHeader";
import { AccountTable } from "./AccountTable";
import { AccountCard } from "./AccountCard";
import { AccountDialog } from "./AccountDialog";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const ManageAccountPage = () => {
  const {
    accounts,
    branches,
    meta,
    isLoading,
    searchQuery,
    roleFilter,
    setRoleFilter,
    dialogOpen,
    setDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedAccount,
    isSubmitting,
    isDeleting,
    handleSearchChange,
    handlePageChange,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
    handleDeleteConfirm,
  } = useManageAccount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AccountHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onAddClick={handleAddClick}
      />

      {/* Desktop Table */}
      <div className="hidden md:block shadow-[0_4px_30px_rgba(0,0,0,0.02)] rounded-3xl bg-white overflow-hidden">
        <AccountTable
          accounts={accounts}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-4 flex gap-4 animate-pulse"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="w-3/4 h-4 bg-slate-200 rounded" />
                <div className="w-1/2 h-3 bg-slate-100 rounded" />
                <div className="w-1/3 h-3 bg-slate-100 rounded" />
              </div>
            </div>
          ))
        ) : accounts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-8 text-center"
          >
            <p className="font-medium text-[#2c2f30]">No accounts found</p>
            <p className="text-sm text-[#595c5d] mt-1">Try adjusting your search or filter.</p>
          </motion.div>
        ) : (
          accounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              index={index}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))
        )}
      </div>

      {!isLoading && meta.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mt-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100"
        >
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold">{accounts.length}</span> of{" "}
            <span className="font-semibold">{meta.total}</span> accounts
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page === 1}
              onClick={() => handlePageChange(meta.page - 1)}
              className="rounded-lg h-9 w-9 p-0 bg-white border-slate-200"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={meta.page === i + 1 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                  className={`h-9 w-9 rounded-lg ${
                    meta.page === i + 1
                      ? "bg-teal-900 text-white shadow-md shadow-teal-900/10"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page === meta.totalPages}
              onClick={() => handlePageChange(meta.page + 1)}
              className="rounded-lg h-9 w-9 p-0 bg-white border-slate-200"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <AccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        branches={branches}
        account={selectedAccount}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        account={selectedAccount}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </motion.div>
  );
};

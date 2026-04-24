"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { DeleteCategoryDialogProps } from "@/features/manageCategories/types/manageCategory.type";

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  open,
  onOpenChange,
  category,
  onConfirm,
  isDeleting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#2c2f30]">
                Delete Category
              </DialogTitle>
              <DialogDescription className="text-[#595c5d] text-sm">
                This action is permanent and cannot be undone.
              </DialogDescription>
            </div>
          </div>

          <div className="bg-[#fef2f2] rounded-xl p-4 border border-red-100 mb-6">
            <p className="text-sm text-red-800 font-medium">
              Are you sure you want to delete{" "}
              <span className="font-bold underline">"{category?.name}"</span>?
            </p>
            <p className="text-xs text-red-600/80 mt-1">
              All products associated with this category may lose their
              classification.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl hover:bg-[#f0f1f2] text-[#595c5d] font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-200"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DeleteAccountDialogProps } from "../types/manageAccount.type";

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onOpenChange,
  account,
  onConfirm,
  isDeleting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent className="sm:max-w-sm" showCloseButton>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#b31b25] shrink-0">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-[#2c2f30]">
                      Delete Account
                    </DialogTitle>
                    <DialogDescription className="mt-0.5">
                      This action cannot be undone.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-4 p-3 rounded-lg bg-red-50/50 border border-red-100">
                <p className="text-sm text-[#2c2f30]">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    &ldquo;{account?.username || account?.email}&rdquo;
                  </span>
                  ? This user will lose all access to the platform.
                </p>
              </div>

              <DialogFooter className="mt-4">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#595c5d] hover:bg-[#eff1f2] transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-lg bg-[#b31b25] text-white text-sm font-medium shadow-sm hover:bg-[#9f0519] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </motion.button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StockJournalDialogProps, TransactionType } from "../types/manageStock.type";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ClockIcon } from "@heroicons/react/24/outline";

export const StockJournalDialog: React.FC<StockJournalDialogProps> = ({
  open,
  onOpenChange,
  inventoryItem,
  journals,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogContent
            className="sm:max-w-xl bg-white rounded-2xl overflow-hidden border-none shadow-2xl p-0"
            showCloseButton
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#eff1f2]">
                <DialogTitle className="text-xl font-bold text-[#2c2f30]">
                  Stock History Journal
                </DialogTitle>
                <DialogDescription className="text-[#595c5d] text-sm font-medium">
                  Inventory movements for <strong>{inventoryItem?.product?.productName}</strong>
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-8 h-8 rounded-full border-2 border-[#006666] border-t-transparent animate-spin" />
                    <p className="text-sm text-[#595c5d] font-medium">Loading history...</p>
                  </div>
                ) : journals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 bg-[#f5f6f7] rounded-full flex items-center justify-center mb-3 text-[#595c5d]">
                      <ClockIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-[#2c2f30]">No history found</p>
                    <p className="text-xs text-[#595c5d] mt-1">There are no recorded movements for this item yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eff1f2]">
                    {journals.map((log, i) => {
                      const isAddition = log.transactionType === TransactionType.IN;
                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="relative pl-10 group"
                        >
                          <div className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm ${
                            isAddition ? "bg-[#e6f4ea] text-emerald-600" : "bg-red-50 text-red-600"
                          }`}>
                            {isAddition ? (
                              <ArrowTrendingUpIcon className="w-4 h-4" />
                            ) : (
                              <ArrowTrendingDownIcon className="w-4 h-4" />
                            )}
                          </div>

                          <div className="bg-[#f5f6f7]/50 rounded-xl p-4 transition-colors group-hover:bg-[#f5f6f7]">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-[#595c5d]">
                                  {isAddition ? "Stock Added" : "Stock Reduced"}
                                </p>
                                <p className="text-sm font-bold text-[#2c2f30]">
                                  {isAddition ? "+" : "-"}{log.quantityChange} units
                                </p>
                              </div>
                              <span className="text-[10px] font-mono text-[#595c5d] bg-white px-2 py-0.5 rounded border border-[#eff1f2]">
                                {format(new Date(log.createdAt), "MMM d, HH:mm")}
                              </span>
                            </div>

                            <p className="text-xs text-[#595c5d] mt-3 leading-relaxed bg-white/50 p-2 rounded-lg italic">
                              "{log.notes || "No notes provided"}"
                            </p>

                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#eff1f2]">
                              <div className="space-y-0.5">
                                <p className="text-[9px] uppercase font-bold text-[#595c5d]/60">Before</p>
                                <p className="text-xs font-bold text-[#2c2f30]">{log.stockBefore}</p>
                              </div>
                              <div className="w-px h-6 bg-[#eff1f2]" />
                              <div className="space-y-0.5">
                                <p className="text-[9px] uppercase font-bold text-[#595c5d]/60">After</p>
                                <p className="text-xs font-bold text-[#006666]">{log.stockAfter}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              <div className="p-6 bg-[#f5f6f7] flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onOpenChange(false)}
                  className="px-6 py-2 bg-white border border-[#eff1f2] rounded-lg text-sm font-bold text-[#2c2f30] hover:bg-[#eff1f2] transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

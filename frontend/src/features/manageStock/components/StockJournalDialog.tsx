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
import {
  StockJournalDialogProps,
  TransactionType,
} from "../types/manageStock.type";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

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
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#eff1f2] bg-white sticky top-0 z-20">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-[#006666]/5 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-[#006666]" />
                  </div>
                  <DialogTitle className="text-xl font-bold text-[#2c2f30]">
                    Stock History Journal
                  </DialogTitle>
                </div>
                <DialogDescription className="text-[#595c5d] text-sm font-medium">
                  Inventory movements for{" "}
                  <strong>{inventoryItem?.product?.productName}</strong>
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="h-[450px] w-full">
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                      <div className="w-10 h-10 rounded-full border-3 border-[#006666] border-t-transparent animate-spin" />
                      <p className="text-sm text-[#595c5d] font-bold tracking-tight">
                        Loading history...
                      </p>
                    </div>
                  ) : journals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 bg-[#f5f6f7] rounded-full flex items-center justify-center mb-4 text-[#595c5d]/50">
                        <ClockIcon className="w-8 h-8" />
                      </div>
                      <p className="text-base font-bold text-[#2c2f30]">
                        No history found
                      </p>
                      <p className="text-sm text-[#595c5d] mt-1 max-w-[240px]">
                        There are no recorded movements for this item yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-[#006666]/20 before:via-[#006666]/10 before:to-transparent">
                      {journals.map((log, i) => {
                        const isAddition =
                          log.transactionType === TransactionType.IN;
                        return (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative pl-12 group"
                          >
                            <div
                              className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-md transition-transform group-hover:scale-110 ${
                                isAddition
                                  ? "bg-emerald-500 text-white"
                                  : "bg-rose-500 text-white"
                              }`}
                            >
                              {isAddition ? (
                                <ArrowTrendingUpIcon className="w-4.5 h-4.5 stroke-[2.5]" />
                              ) : (
                                <ArrowTrendingDownIcon className="w-4.5 h-4.5 stroke-[2.5]" />
                              )}
                            </div>

                            <div className="bg-white border border-[#eff1f2] rounded-2xl p-5 shadow-xs transition-all hover:shadow-md hover:border-[#006666]/20 group-hover:-translate-y-0.5">
                              <div className="flex justify-between items-start mb-3">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                        isAddition
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-rose-100 text-rose-700"
                                      }`}
                                    >
                                      {isAddition ? "Restock" : "Deduction"}
                                    </span>
                                    <span className="text-[10px] font-medium text-[#595c5d] bg-[#f5f6f7] px-2 py-0.5 rounded-full">
                                      {log.referenceType}
                                    </span>
                                  </div>
                                  <p className="text-lg font-black text-[#2c2f30] flex items-baseline gap-1">
                                    {isAddition ? "+" : "-"}
                                    {log.quantityChange}
                                    <span className="text-xs font-bold text-[#595c5d]/60 uppercase tracking-tighter">
                                      Units
                                    </span>
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-[#2c2f30]">
                                    {format(
                                      new Date(log.createdAt),
                                      "MMM d, yyyy",
                                    )}
                                  </p>
                                  <p className="text-[10px] font-medium text-[#595c5d]">
                                    {format(new Date(log.createdAt), "HH:mm")}
                                  </p>
                                </div>
                              </div>

                              <div className="relative mb-4">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#006666]/10 rounded-full" />
                                <p className="text-xs text-[#595c5d] pl-4 py-1 italic leading-relaxed">
                                  {log.notes || "No notes provided"}
                                </p>
                              </div>

                              <div className="flex items-center gap-6 pt-4 border-t border-[#f5f6f7]">
                                <div className="space-y-0.5">
                                  <p className="text-[9px] uppercase font-bold text-[#595c5d]/40 tracking-wider">
                                    Before
                                  </p>
                                  <p className="text-sm font-bold text-[#2c2f30] font-mono">
                                    {log.stockBefore}
                                  </p>
                                </div>
                                <div className="w-px h-6 bg-[#eff1f2]" />
                                <div className="space-y-0.5">
                                  <p className="text-[9px] uppercase font-bold text-[#595c5d]/40 tracking-wider">
                                    After
                                  </p>
                                  <p className="text-sm font-bold text-[#006666] font-mono">
                                    {log.stockAfter}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 px-6 bg-white border-t border-[#eff1f2] flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onOpenChange(false)}
                  className="px-8 py-2.5 bg-[#2c2f30] text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:bg-black transition-all cursor-pointer"
                >
                  Close History
                </motion.button>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

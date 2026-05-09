import React, { useState } from "react";
import { DetailedStockItem, StockReportProps } from "../types/report.type";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  EyeIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { ReportRepository } from "../repositories/report.repository";

const repo = new ReportRepository();

export const StockReport: React.FC<StockReportProps> = ({
  data,
  isLoading,
  month,
  year,
  branchId,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedStockItem[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [visibleStockCount, setVisibleStockCount] = useState(5);
  const [stockQuery, setStockQuery] = useState("");

  const handleViewDetails = async (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setIsDetailLoading(true);
    try {
      const res = await repo.getDetailedStockReport(productId, month, year);
      setDetailedData(res);
    } catch (error) {
      console.error("Failed to fetch detailed stock", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
    setDetailedData([]);
  };

  const handleLoadMore = () => {
    setVisibleStockCount((prev) => prev + 5);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-96 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!data)
    return (
      <div className="text-center p-12 text-[#595c5d] bg-white rounded-3xl shadow-sm border border-slate-100">
        No stock data available for this period.
      </div>
    );

  const filteredData = (data || []).filter((item) =>
    item.productName.toLowerCase().includes(stockQuery.toLowerCase()),
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${month}-${year}-${branchId}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-8"
      >
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white py-0">
          <CardHeader className="bg-[#e6e8ea] px-8 py-5 border-b border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none">
            <CardTitle className="text-lg font-bold text-[#2c2f30]">
              Monthly Stock Summary
            </CardTitle>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0a3a3]" />
              <input
                type="text"
                placeholder="Search product..."
                value={stockQuery}
                onChange={(e) => setStockQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006666]/10 w-full sm:w-64 transition-all"
              />
            </div>
          </CardHeader>
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                    Product
                  </TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                    Total Additions (+)
                  </TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                    Total Deductions (-)
                  </TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                    Ending Stock
                  </TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.slice(0, visibleStockCount).map((item) => (
                    <TableRow
                      key={item.productId}
                      className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors"
                    >
                      <TableCell className="px-8 py-4 font-bold text-[#2c2f30]">
                        {item.productName}
                      </TableCell>
                      <TableCell className="text-right px-8 py-4 text-green-600 font-bold">
                        +{item.totalAdditions}
                      </TableCell>
                      <TableCell className="text-right px-8 py-4 text-red-600 font-bold">
                        -{item.totalDeductions}
                      </TableCell>
                      <TableCell className="text-right px-8 py-4 font-extrabold text-[#006666]">
                        {item.endingStock}
                      </TableCell>
                      <TableCell className="text-right px-8 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#006666] font-bold hover:bg-[#006666]/5 rounded-xl"
                          onClick={() =>
                            handleViewDetails(item.productId, item.productName)
                          }
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="px-8 py-12 text-center text-[#a0a3a3]"
                    >
                      No products found matching &quot;{stockQuery}&quot;
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {visibleStockCount < filteredData.length && (
            <div className="p-6 bg-white text-center border-t border-slate-50">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#006666] font-bold hover:bg-[#006666]/5 rounded-xl px-6"
                onClick={handleLoadMore}
              >
                <ChevronDownIcon className="w-4 h-4 mr-2" />
                Load More
              </Button>
            </div>
          )}
        </Card>

        <Dialog open={!!selectedProduct} onOpenChange={handleCloseDetail}>
          <AnimatePresence>
            {selectedProduct && (
              <DialogContent className="sm:max-w-xl bg-white rounded-2xl overflow-hidden border-none shadow-2xl p-0">
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
                      <strong>{selectedProduct.name}</strong>
                    </DialogDescription>
                  </DialogHeader>

                  <ScrollArea className="h-[450px] w-full">
                    <div className="p-6">
                      {isDetailLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                          <div className="w-10 h-10 rounded-full border-3 border-[#006666] border-t-transparent animate-spin" />
                          <p className="text-sm text-[#595c5d] font-bold tracking-tight">
                            Loading history...
                          </p>
                        </div>
                      ) : detailedData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-16 h-16 bg-[#f5f6f7] rounded-full flex items-center justify-center mb-4 text-[#595c5d]/50">
                            <ClockIcon className="w-8 h-8" />
                          </div>
                          <p className="text-base font-bold text-[#2c2f30]">
                            No history found
                          </p>
                          <p className="text-sm text-[#595c5d] mt-1 max-w-[240px]">
                            There are no recorded movements for this period.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-linear-to-b before:from-[#006666]/20 before:via-[#006666]/10 before:to-transparent">
                          {detailedData.map((detail, i) => {
                            const isAddition = detail.transactionType === "IN";
                            return (
                              <motion.div
                                key={detail.id}
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
                                          {isAddition
                                            ? "Addition"
                                            : "Deduction"}
                                        </span>
                                        <span className="text-[10px] font-medium text-[#595c5d] bg-[#f5f6f7] px-2 py-0.5 rounded-full uppercase">
                                          {detail.referenceType}
                                        </span>
                                      </div>
                                      <p className="text-lg font-black text-[#2c2f30] flex items-baseline gap-1">
                                        {isAddition ? "+" : "-"}
                                        {detail.quantityChange}
                                        <span className="text-xs font-bold text-[#595c5d]/60 uppercase tracking-tighter">
                                          Units
                                        </span>
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] font-bold text-[#2c2f30]">
                                        {format(
                                          new Date(detail.createdAt),
                                          "MMM d, yyyy",
                                        )}
                                      </p>
                                      <p className="text-[10px] font-medium text-[#595c5d]">
                                        {format(
                                          new Date(detail.createdAt),
                                          "HH:mm",
                                        )}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-6 pt-4 border-t border-[#f5f6f7]">
                                    <div className="space-y-0.5">
                                      <p className="text-[9px] uppercase font-bold text-[#595c5d]/40 tracking-wider">
                                        Before
                                      </p>
                                      <p className="text-sm font-bold text-[#2c2f30] font-mono">
                                        {detail.stockBefore}
                                      </p>
                                    </div>
                                    <div className="w-px h-6 bg-[#eff1f2]" />
                                    <div className="space-y-0.5">
                                      <p className="text-[9px] uppercase font-bold text-[#595c5d]/40 tracking-wider">
                                        After
                                      </p>
                                      <p className="text-sm font-bold text-[#006666] font-mono">
                                        {detail.stockAfter}
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
                      onClick={handleCloseDetail}
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
      </motion.div>
    </AnimatePresence>
  );
};

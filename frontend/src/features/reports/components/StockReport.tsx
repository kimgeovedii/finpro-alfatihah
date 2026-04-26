import React, { useState } from "react";
import { StockReportData, DetailedStockItem } from "../types/report.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EyeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { ReportRepository } from "../repositories/report.repository";
import { Badge } from "@/components/ui/badge";

const repo = new ReportRepository();

interface StockReportProps {
  data: StockReportData | null;
  isLoading: boolean;
  month: number;
  year: number;
}

export const StockReport: React.FC<StockReportProps> = ({ data, isLoading, month, year }) => {
  const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string} | null>(null);
  const [detailedData, setDetailedData] = useState<DetailedStockItem[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [visibleStockCount, setVisibleStockCount] = useState(5);

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
    return <div className="animate-pulse space-y-6">
      <div className="h-96 bg-slate-200 rounded-3xl" />
    </div>;
  }

  if (!data) return <div className="text-center p-12 text-[#595c5d] bg-white rounded-3xl shadow-sm border border-slate-100">No stock data available for this period.</div>;

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-[#2c2f30]">Monthly Stock Summary</CardTitle>
        </CardHeader>
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-100">
                <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Product</TableHead>
                <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Total Additions (+)</TableHead>
                <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Total Deductions (-)</TableHead>
                <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Ending Stock</TableHead>
                <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, visibleStockCount).map((item) => (
                <TableRow key={item.productId} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors">
                  <TableCell className="px-8 py-4 font-bold text-[#2c2f30]">{item.productName}</TableCell>
                  <TableCell className="text-right px-8 py-4 text-green-600 font-bold">+{item.totalAdditions}</TableCell>
                  <TableCell className="text-right px-8 py-4 text-red-600 font-bold">-{item.totalDeductions}</TableCell>
                  <TableCell className="text-right px-8 py-4 font-extrabold text-[#006666]">{item.endingStock}</TableCell>
                  <TableCell className="text-right px-8 py-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#006666] font-bold hover:bg-[#006666]/5 rounded-xl"
                      onClick={() => handleViewDetails(item.productId, item.productName)}
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {visibleStockCount < data.length && (
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
        <DialogContent className="max-w-4xl border-none shadow-2xl p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="px-8 py-8 bg-linear-to-br from-[#006666] to-[#004d4d] text-white">
            <DialogTitle className="text-2xl font-bold tracking-tight">Stock History: {selectedProduct?.name}</DialogTitle>
            <DialogDescription className="text-white/70 text-sm mt-1">Detailed stock mutations and branch movements for this month.</DialogDescription>
          </DialogHeader>
          <div className="p-0">
            {isDetailLoading ? (
              <div className="text-center py-12 text-[#595c5d]">
                <div className="animate-spin w-8 h-8 border-4 border-[#006666] border-t-transparent rounded-full mx-auto mb-4" />
                Loading history...
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b border-slate-100">
                      <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Date</TableHead>
                      <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Branch</TableHead>
                      <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Type</TableHead>
                      <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Change</TableHead>
                      <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Before</TableHead>
                      <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">After</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedData.map((detail) => (
                      <TableRow key={detail.id} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors">
                        <TableCell className="px-8 py-4 text-sm font-medium text-[#64748b] whitespace-nowrap">{format(new Date(detail.createdAt), "dd MMM yyyy, HH:mm")}</TableCell>
                        <TableCell className="px-8 py-4 text-sm font-bold text-[#2c2f30]">{detail.branchInventory?.branch?.storeName || 'Main Store'}</TableCell>
                        <TableCell className="px-8 py-4">
                          <Badge variant="outline" className={`border-none rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${detail.transactionType === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {detail.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right px-8 py-4 font-bold ${detail.transactionType === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                          {detail.transactionType === 'IN' ? '+' : '-'}{detail.quantityChange}
                        </TableCell>
                        <TableCell className="text-right px-8 py-4 text-sm text-[#64748b]">{detail.stockBefore}</TableCell>
                        <TableCell className="text-right px-8 py-4 font-bold text-[#006666]">{detail.stockAfter}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
            <Button onClick={handleCloseDetail} className="bg-[#006666] hover:bg-[#005959] text-white font-bold rounded-xl px-8">
              Close History
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

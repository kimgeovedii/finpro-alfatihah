"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportHeader } from "./ReportHeader";
import { SalesReport } from "./SalesReport";
import { StockReport } from "./StockReport";
import { useReports } from "../hooks/useReports";

export const ReportPage: React.FC = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    month,
    year,
    branchId,
    branches,
    isStoreAdmin,
    setMonth,
    setYear,
    setBranchId,
    salesData,
    stockData,
    isLoadingSales,
    isLoadingStock,
  } = useReports();

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-8 min-h-screen bg-[#f8fafc] rounded-4xl"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <ReportHeader
          month={month}
          year={year}
          branchId={branchId}
          branches={branches}
          isStoreAdmin={isStoreAdmin}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onBranchChange={setBranchId}
        />

        <Tabs defaultValue="sales" className="space-y-10">
          <div className="flex justify-start">
            <TabsList className="bg-[#eff1f2] px-1 py-5 rounded-xl border border-[#eff1f2] h-auto gap-2 shadow-none max-w-full">
              <TabsTrigger
                value="sales"
                className="px-4 sm:px-6 py-4 whitespace-nowrap rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#006666] data-[state=active]:shadow-sm text-[#595c5d] hover:text-[#2c2f30] border-none shadow-none focus:ring-0"
              >
                Sales Report
              </TabsTrigger>
              <TabsTrigger
                value="stock"
                className="px-4 sm:px-6 py-4 whitespace-nowrap rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#006666] data-[state=active]:shadow-sm text-[#595c5d] hover:text-[#2c2f30] border-none shadow-none focus:ring-0"
              >
                Stock Report
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sales" className="mt-0 outline-none">
            <SalesReport
              data={salesData}
              isLoading={isLoadingSales}
              month={month}
              year={year}
              branchId={branchId}
            />
          </TabsContent>

          <TabsContent value="stock" className="mt-0 outline-none">
            <StockReport
              data={stockData}
              isLoading={isLoadingStock}
              month={month}
              year={year}
              branchId={branchId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

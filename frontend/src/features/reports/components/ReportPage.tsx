"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportHeader } from "./ReportHeader";
import { SalesReport } from "./SalesReport";
import { StockReport } from "./StockReport";
import { useReports } from "../hooks/useReports";

export const ReportPage: React.FC = () => {
  const {
    month,
    year,
    setMonth,
    setYear,
    salesData,
    stockData,
    isLoadingSales,
    isLoadingStock
  } = useReports();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-8 min-h-screen bg-[#f8fafc]"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <ReportHeader 
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />

        <Tabs defaultValue="sales" className="space-y-8">
          <div className="flex justify-start border-b border-slate-200 pb-4">
            <TabsList className="bg-slate-100/50 p-1 rounded-2xl border border-slate-100 shadow-sm">
              <TabsTrigger 
                value="sales" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#006666] data-[state=active]:shadow-md px-8 py-2.5 text-sm font-bold transition-all"
              >
                Sales Report
              </TabsTrigger>
              <TabsTrigger 
                value="stock" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#006666] data-[state=active]:shadow-md px-8 py-2.5 text-sm font-bold transition-all"
              >
                Stock Report
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sales" className="mt-0 outline-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <SalesReport data={salesData} isLoading={isLoadingSales} />
            </motion.div>
          </TabsContent>

          <TabsContent value="stock" className="mt-0 outline-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <StockReport data={stockData} isLoading={isLoadingStock} month={month} year={year} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

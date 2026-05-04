import React, { useState } from "react";
import { SalesReportProps } from "../types/report.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingBagIcon,
  BanknotesIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

import { motion, AnimatePresence } from "framer-motion";

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const SalesReport: React.FC<SalesReportProps> = ({
  data,
  isLoading,
  month,
  year,
  branchId,
}) => {
  const [visibleProductCount, setVisibleProductCount] = useState(5);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(5);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-slate-200 rounded-3xl" />
          <div className="h-40 bg-slate-200 rounded-3xl" />
        </div>
        <div className="h-96 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-3xl" />
          <div className="h-80 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <div className="text-center p-12 text-[#595c5d] bg-white rounded-3xl shadow-sm border border-slate-100">
        No sales data available for this period.
      </div>
    );

  const handleLoadMoreProducts = () => {
    setVisibleProductCount((prev) => prev + 5);
  };

  const handleLoadMoreCategories = () => {
    setVisibleCategoryCount((prev) => prev + 5);
  };

  const chartData = (data?.yearlyTrend || []).map((item) => ({
    name: monthNames[item.month - 1],
    revenue: item.revenue,
  }));

  const filteredCategories = (data?.byCategory || []).filter((c) =>
    c.categoryName.toLowerCase().includes(categoryQuery.toLowerCase()),
  );

  const filteredProducts = (data?.byProduct || []).filter((p) =>
    p.productName.toLowerCase().includes(productQuery.toLowerCase()),
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
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-md transition-shadow duration-300 py-0">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="p-4 bg-[#006666]/5 rounded-2xl group-hover:bg-[#006666]/10 transition-all duration-300 mb-6">
                <BanknotesIcon className="w-10 h-10 text-[#006666]" />
              </div>
              <div>
                <p className="text-[#595c5d] text-sm font-semibold uppercase tracking-widest mb-2 opacity-80">
                  Monthly Revenue
                </p>
                <h3 className="text-4xl font-extrabold text-[#2c2f30] tracking-tight">
                  {formatIDR(data.summary.totalRevenue)}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-md transition-shadow duration-300 py-0">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="p-4 bg-[#006666]/5 rounded-2xl group-hover:bg-[#006666]/10 transition-all duration-300 mb-6">
                <ShoppingBagIcon className="w-10 h-10 text-[#006666]" />
              </div>
              <div>
                <p className="text-[#595c5d] text-sm font-semibold uppercase tracking-widest mb-2 opacity-80">
                  Total Orders
                </p>
                <h3 className="text-4xl font-extrabold text-[#2c2f30] tracking-tight">
                  {data.summary.totalOrders}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Trends Chart */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white py-0">
          <CardHeader className="px-8 pt-8 pb-0 flex flex-row items-center justify-between rounded-none">
            <div>
              <CardTitle className="text-xl font-bold text-[#2c2f30]">
                Sales Trends
              </CardTitle>
              <p className="text-sm text-[#595c5d] mt-1">
                Monthly revenue performance for the current year
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tickFormatter={(val) => `Rp${val / 1000}k`}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    contentStyle={{
                      border: "none",
                      borderRadius: "16px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value: any) => [
                      formatIDR(Number(value)),
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#006666"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-8">
          {/* Sales by Category */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden flex flex-col bg-white py-0">
            <CardHeader className="bg-[#e6e8ea] px-8 py-5 border-b border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none">
              <CardTitle className="text-lg font-bold text-[#2c2f30]">
                Sales by Category
              </CardTitle>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0a3a3]" />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={categoryQuery}
                  onChange={(e) => setCategoryQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006666]/10 w-full sm:w-64 transition-all"
                />
              </div>
            </CardHeader>
            <div className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                      Category
                    </TableHead>
                    <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                      SKUs
                    </TableHead>
                    <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                      Revenue
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories
                      .slice(0, visibleCategoryCount)
                      .map((category) => (
                        <TableRow
                          key={category.categoryId}
                          className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <TableCell className="px-8 py-4">
                            <span className="font-bold text-[#2c2f30]">
                              {category.categoryName}
                            </span>
                          </TableCell>
                          <TableCell className="text-right px-8 py-4 font-medium text-[#595c5d]">
                            {category.quantitySold}
                          </TableCell>
                          <TableCell className="text-right px-8 py-4 font-bold text-[#006666]">
                            {formatIDR(category.revenue)}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-8 py-12 text-center text-[#a0a3a3]"
                      >
                        No categories found matching &quot;{categoryQuery}&quot;
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {visibleCategoryCount < filteredCategories.length && (
              <div className="p-6 bg-white text-center border-t border-slate-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#006666] font-bold hover:bg-[#006666]/5 rounded-xl px-6"
                  onClick={handleLoadMoreCategories}
                >
                  <ChevronDownIcon className="w-4 h-4 mr-2" />
                  Load More
                </Button>
              </div>
            )}
          </Card>

          {/* Sales by Products */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden flex flex-col bg-white py-0">
            <CardHeader className="bg-[#e6e8ea] px-8 py-5 border-b border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none">
              <CardTitle className="text-lg font-bold text-[#2c2f30]">
                Sales by Products
              </CardTitle>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0a3a3]" />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
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
                      Units Sold
                    </TableHead>
                    <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                      Revenue
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts
                      .slice(0, visibleProductCount)
                      .map((product) => (
                        <TableRow
                          key={product.productId}
                          className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <TableCell className="px-8 py-4">
                            <span className="font-bold text-[#2c2f30]">
                              {product.productName}
                            </span>
                          </TableCell>
                          <TableCell className="text-right px-8 py-4 font-medium text-[#595c5d]">
                            {product.quantitySold}
                          </TableCell>
                          <TableCell className="text-right px-8 py-4 font-bold text-[#006666]">
                            {formatIDR(product.revenue)}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="px-8 py-12 text-center text-[#a0a3a3]"
                      >
                        No products found matching &quot;{productQuery}&quot;
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {visibleProductCount < filteredProducts.length && (
              <div className="p-6 bg-white text-center border-t border-slate-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#006666] font-bold hover:bg-[#006666]/5 rounded-xl px-6"
                  onClick={handleLoadMoreProducts}
                >
                  <ChevronDownIcon className="w-4 h-4 mr-2" />
                  Load More
                </Button>
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState } from "react";
import { SalesReportData } from "../types/report.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShoppingBagIcon, EyeIcon, ChevronDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SalesReportProps {
  data: SalesReportData | null;
  isLoading: boolean;
}

const formatIDR = (value: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const SalesReport: React.FC<SalesReportProps> = ({ data, isLoading }) => {
  const [visibleProductCount, setVisibleProductCount] = useState(5);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(5);

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 bg-slate-200 rounded-3xl" />
        <div className="h-40 bg-slate-200 rounded-3xl" />
      </div>
      <div className="h-96 bg-slate-200 rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-200 rounded-3xl" />
        <div className="h-80 bg-slate-200 rounded-3xl" />
      </div>
    </div>;
  }

  if (!data) return <div className="text-center p-12 text-[#595c5d] bg-white rounded-3xl shadow-sm border border-slate-100">No sales data available for this period.</div>;

  const handleLoadMoreProducts = () => {
    setVisibleProductCount((prev) => prev + 5);
  };

  const handleLoadMoreCategories = () => {
    setVisibleCategoryCount((prev) => prev + 5);
  };

  const chartData = data.yearlyTrend.map(item => ({
    name: monthNames[item.month - 1],
    revenue: item.revenue
  }));

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#006666]/5 rounded-2xl group-hover:bg-[#006666]/10 transition-colors">
                <EyeIcon className="w-8 h-8 text-[#006666]" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-none rounded-full px-3 py-1 font-semibold flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-3 h-3" />
                +12.5%
              </Badge>
            </div>
            <div>
              <p className="text-[#595c5d] text-sm font-semibold uppercase tracking-wider mb-1">Monthly Revenue</p>
              <h3 className="text-4xl font-extrabold text-[#2c2f30] tracking-tight">{formatIDR(data.summary.totalRevenue)}</h3>
              <p className="text-xs text-[#595c5d] mt-2">vs last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#006666]/5 rounded-2xl group-hover:bg-[#006666]/10 transition-colors">
                <ShoppingBagIcon className="w-8 h-8 text-[#006666]" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-none rounded-full px-3 py-1 font-semibold flex items-center gap-1">
                <ArrowTrendingUpIcon className="w-3 h-3" />
                +8.2%
              </Badge>
            </div>
            <div>
              <p className="text-[#595c5d] text-sm font-semibold uppercase tracking-wider mb-1">Total Orders</p>
              <h3 className="text-4xl font-extrabold text-[#2c2f30] tracking-tight">{data.summary.totalOrders}</h3>
              <p className="text-xs text-[#595c5d] mt-2">vs last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trends Chart */}
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="px-8 pt-8 pb-0 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-[#2c2f30]">Sales Trends</CardTitle>
            <p className="text-sm text-[#595c5d] mt-1">Monthly revenue performance for the current year</p>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(val) => `Rp${val / 1000}k`} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }} 
                  contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [formatIDR(Number(value)), 'Revenue']}
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
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden flex flex-col bg-white">
          <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-[#2c2f30]">Sales by Category</CardTitle>
          </CardHeader>
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Category</TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">SKUs</TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byCategory.slice(0, visibleCategoryCount).map((category) => (
                  <TableRow key={category.categoryId} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors">
                    <TableCell className="px-8 py-4">
                      <span className="font-bold text-[#2c2f30]">{category.categoryName}</span>
                    </TableCell>
                    <TableCell className="text-right px-8 py-4 font-medium text-[#595c5d]">{category.quantitySold}</TableCell>
                    <TableCell className="text-right px-8 py-4 font-bold text-[#006666]">{formatIDR(category.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {visibleCategoryCount < data.byCategory.length && (
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
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden flex flex-col bg-white">
          <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-[#2c2f30]">Sales by Products</CardTitle>
          </CardHeader>
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Product</TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Units Sold</TableHead>
                  <TableHead className="text-right px-8 h-12 text-xs font-bold uppercase tracking-widest text-[#64748b]">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byProduct.slice(0, visibleProductCount).map((product) => (
                  <TableRow key={product.productId} className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors">
                    <TableCell className="px-8 py-4">
                      <span className="font-bold text-[#2c2f30]">{product.productName}</span>
                    </TableCell>
                    <TableCell className="text-right px-8 py-4 font-medium text-[#595c5d]">{product.quantitySold}</TableCell>
                    <TableCell className="text-right px-8 py-4 font-bold text-[#006666]">{formatIDR(product.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {visibleProductCount < data.byProduct.length && (
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
    </div>
  );
};

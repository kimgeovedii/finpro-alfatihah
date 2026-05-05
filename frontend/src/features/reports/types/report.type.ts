export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
}

export interface SalesByCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
  quantitySold: number;
}

export interface SalesByProduct {
  productId: string;
  productName: string;
  revenue: number;
  quantitySold: number;
}

export interface YearlyTrend {
  month: number;
  revenue: number;
}

export interface SalesReportProps {
  data: SalesReportData | null;
  isLoading: boolean;
  month: number;
  year: number;
  branchId: string;
}

export interface SalesReportData {
  summary: SalesSummary;
  byCategory: SalesByCategory[];
  byProduct: SalesByProduct[];
  yearlyTrend: YearlyTrend[];
}

export interface StockSummaryItem {
  productId: string;
  productName: string;
  totalAdditions: number;
  totalDeductions: number;
  endingStock: number;
}

export type StockReportData = StockSummaryItem[];

import { Branch } from "@/features/manageStock/types/manageStock.type";

export interface UserWithEmployee {
  employee?: {
    role: "STORE_ADMIN" | "SUPER_ADMIN";
    branchId?: string;
  };
}

export interface ReportHeaderProps {
  month: number;
  year: number;
  branchId: string;
  branches: Branch[];
  isStoreAdmin: boolean;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onBranchChange: (branchId: string) => void;
}

export interface StockReportProps {
  data: StockReportData | null;
  isLoading: boolean;
  month: number;
  year: number;
  branchId: string;
}

export interface DetailedStockItem {
  id: string;
  transactionType: "IN" | "OUT";
  referenceType: "ORDER" | "MANUAL" | "MUTATION";
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  createdAt: string;
  branchInventory: {
    branch: {
      storeName: string;
    };
  };
}

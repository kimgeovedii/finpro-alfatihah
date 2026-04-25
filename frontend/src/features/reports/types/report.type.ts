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

export interface DetailedStockItem {
  id: string;
  transactionType: "IN" | "OUT";
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

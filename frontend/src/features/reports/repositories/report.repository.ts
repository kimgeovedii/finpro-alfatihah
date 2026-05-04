import { apiFetch } from "@/utils/api";
import { SalesReportData, StockReportData, DetailedStockItem } from "../types/report.type";

export class ReportRepository {
  public async getSalesReport(month: number, year: number, branchId?: string): Promise<SalesReportData> {
    const branchQuery = branchId && branchId !== "all" ? `&branchId=${branchId}` : "";
    return await apiFetch<SalesReportData>(`/reports/sales?month=${month}&year=${year}${branchQuery}`, "get");
  }

  public async getStockReport(month: number, year: number, branchId?: string): Promise<StockReportData> {
    const branchQuery = branchId && branchId !== "all" ? `&branchId=${branchId}` : "";
    return await apiFetch<StockReportData>(`/reports/stocks?month=${month}&year=${year}${branchQuery}`, "get");
  }

  public async getDetailedStockReport(productId: string, month: number, year: number, branchId?: string): Promise<DetailedStockItem[]> {
    const branchQuery = branchId && branchId !== "all" ? `&branchId=${branchId}` : "";
    return await apiFetch<DetailedStockItem[]>(`/reports/stocks/${productId}?month=${month}&year=${year}${branchQuery}`, "get");
  }
}

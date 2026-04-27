import { apiFetch } from "@/utils/api";
import { SalesReportData, StockReportData, DetailedStockItem } from "../types/report.type";

export class ReportRepository {
  public async getSalesReport(month: number, year: number): Promise<SalesReportData> {
    return await apiFetch<SalesReportData>(`/reports/sales?month=${month}&year=${year}`, "get");
  }

  public async getStockReport(month: number, year: number): Promise<StockReportData> {
    return await apiFetch<StockReportData>(`/reports/stocks?month=${month}&year=${year}`, "get");
  }

  public async getDetailedStockReport(productId: string, month: number, year: number): Promise<DetailedStockItem[]> {
    return await apiFetch<DetailedStockItem[]>(`/reports/stocks/${productId}?month=${month}&year=${year}`, "get");
  }
}

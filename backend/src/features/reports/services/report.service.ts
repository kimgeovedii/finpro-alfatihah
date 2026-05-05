import { ReportRepository } from "../repositories/report.repository";

export class ReportService {
  private reportRepository: ReportRepository;

  constructor() {
    this.reportRepository = new ReportRepository();
  }

  public async getSalesReport(month: number, year: number, branchId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const summary = await this.reportRepository.getMonthlySalesSummary(startDate, endDate, branchId);
    const byCategory = await this.reportRepository.getSalesByCategory(startDate, endDate, branchId);
    const byProduct = await this.reportRepository.getSalesByProduct(startDate, endDate, branchId);
    const yearlyTrend = await this.reportRepository.getYearlySalesTrend(year, branchId);

    const formatNumber = (val: any) => typeof val === "bigint" ? Number(val) : val;

    return {
      summary: {
        totalRevenue: summary.totalRevenue,
        totalOrders: summary.totalOrders
      },
      byCategory: byCategory.map((item: any) => ({
        ...item,
        revenue: formatNumber(item.revenue),
        quantitySold: formatNumber(item.quantitySold),
      })),
      byProduct: byProduct.map((item: any) => ({
        ...item,
        revenue: formatNumber(item.revenue),
        quantitySold: formatNumber(item.quantitySold),
      })),
      yearlyTrend: yearlyTrend.map((item: any) => ({
        month: formatNumber(item.month),
        revenue: formatNumber(item.revenue),
      })),
    };
  }

  public async getStockReport(month: number, year: number, branchId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const summary = await this.reportRepository.getStockSummary(startDate, endDate, branchId);
    
    const formatNumber = (val: any) => typeof val === "bigint" ? Number(val) : val;

    return summary.map((item: any) => ({
      ...item,
      totalAdditions: formatNumber(item.totalAdditions),
      totalDeductions: formatNumber(item.totalDeductions),
      endingStock: formatNumber(item.endingStock),
    }));
  }

  public async getDetailedStockReport(productId: string, month: number, year: number, branchId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await this.reportRepository.getDetailedStock(productId, startDate, endDate, branchId);
  }
}

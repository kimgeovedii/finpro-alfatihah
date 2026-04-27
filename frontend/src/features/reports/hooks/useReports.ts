import { useState, useEffect } from "react";
import { SalesReportData, StockReportData } from "../types/report.type";
import { ReportRepository } from "../repositories/report.repository";

const repo = new ReportRepository();

export const useReports = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  
  const [salesData, setSalesData] = useState<SalesReportData | null>(null);
  const [stockData, setStockData] = useState<StockReportData | null>(null);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  const fetchSalesReport = async () => {
    try {
      setIsLoadingSales(true);
      const res = await repo.getSalesReport(month, year);
      setSalesData(res);
    } catch (error) {
      console.error("Failed to fetch sales report", error);
    } finally {
      setIsLoadingSales(false);
    }
  };

  const fetchStockReport = async () => {
    try {
      setIsLoadingStock(true);
      const res = await repo.getStockReport(month, year);
      setStockData(res);
    } catch (error) {
      console.error("Failed to fetch stock report", error);
    } finally {
      setIsLoadingStock(false);
    }
  };

  useEffect(() => {
    fetchSalesReport();
    fetchStockReport();
  }, [month, year]);

  return {
    month,
    year,
    setMonth,
    setYear,
    salesData,
    stockData,
    isLoadingSales,
    isLoadingStock,
    fetchSalesReport,
    fetchStockReport
  };
};

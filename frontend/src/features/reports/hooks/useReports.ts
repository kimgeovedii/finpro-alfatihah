import { useState, useEffect, useCallback } from "react";
import { SalesReportData, StockReportData, UserWithEmployee } from "../types/report.type";
import { ReportRepository } from "../repositories/report.repository";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Branch } from "@/features/manageStock/types/manageStock.type";
import { apiFetch } from "@/utils/api";

const repo = new ReportRepository();

export const useReports = () => {
  const { user } = useAuthStore();
  const employeeUser = user as unknown as UserWithEmployee;

  const isStoreAdmin = employeeUser?.employee?.role === "STORE_ADMIN";
  const userBranchId = employeeUser?.employee?.branchId;

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [branchId, setBranchId] = useState<string>("all");
  const [branches, setBranches] = useState<Branch[]>([]);

  const [salesData, setSalesData] = useState<SalesReportData | null>(null);
  const [stockData, setStockData] = useState<StockReportData | null>(null);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  // Lock branch for STORE_ADMIN
  useEffect(() => {
    if (isStoreAdmin && userBranchId) {
      setBranchId(userBranchId);
    }
  }, [isStoreAdmin, userBranchId]);

  const fetchBranches = async () => {
    try {
      const res = await apiFetch<any>("/branches", "get");
      setBranches(res.data || []);
    } catch (error) {
      console.error("Failed to fetch branches", error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchSalesReport = async () => {
    try {
      setIsLoadingSales(true);
      const res = await repo.getSalesReport(month, year, branchId);
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
      const res = await repo.getStockReport(month, year, branchId);
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
  }, [month, year, branchId]);

  return {
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
    fetchSalesReport,
    fetchStockReport,
  };
};

import { StockManagementPage } from "@/features/manageStock/components/StockManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Management | Al-Fatihah Grocery",
  description: "Monitor and manage product inventory across branches.",
};

export default function StockPage() {
  return <StockManagementPage />;
}

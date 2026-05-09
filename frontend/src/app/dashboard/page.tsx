import { ReportPage } from "@/features/reports/components/ReportPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Report & Analysis",
  description: "View sales and stock reports",
};

export default function Page() {
  return <ReportPage />;
}

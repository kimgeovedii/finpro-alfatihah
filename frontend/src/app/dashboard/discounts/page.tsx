import { DiscountManagementPage } from "@/features/manageDiscounts/components/DiscountManagementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discount Management | Dashboard",
  description: "Manage product discounts and promotions",
};

export default function Page() {
  return <DiscountManagementPage />;
}

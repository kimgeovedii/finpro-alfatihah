import { BranchDetailPage } from "@/features/branches/components/BranchDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Toko | alfatihah",
  description: "Lihat daftar produk lengkap dari toko terdekat Anda di alfatihah.",
};

export default function Page() {
  return <BranchDetailPage />;
}

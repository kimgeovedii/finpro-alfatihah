import React from "react";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { MainFooter } from "@/components/layout/MainFooter";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12 py-8 relative z-10">
        {children}
      </main>
      <MainFooter />
    </div>
  );
}

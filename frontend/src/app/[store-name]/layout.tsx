import React from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alfatihah - Product",
  description: "View grocery item detail",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-3xl mix-blend-multiply"></div>
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-teal-50/60 blur-3xl mix-blend-multiply"></div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        
        <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

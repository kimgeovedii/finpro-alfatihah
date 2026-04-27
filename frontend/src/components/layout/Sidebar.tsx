"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  TagIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  GlobeAmericasIcon,
  ArrowsRightLeftIcon,
  CubeIcon,
  UsersIcon,
  ChevronRightIcon,
  PercentBadgeIcon,
  Square2StackIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { title: "Products", href: "/dashboard/products", icon: CubeIcon },
  { title: "Categories", href: "/dashboard/categories", icon: TagIcon },
  { title: "Accounts", href: "/dashboard/accounts", icon: UsersIcon },
  { title: "Branches", href: "/dashboard/branches", icon: GlobeAmericasIcon },
  { title: "Transactions", href: "/transaction", icon: ArrowsRightLeftIcon },
  { title: "Orders", href: "/manage-order", icon: ClipboardDocumentCheckIcon },
  { title: "Discounts", href: "/dashboard/discounts", icon: PercentBadgeIcon },
  { title: "Stock", href: "/dashboard/stock", icon: Square2StackIcon },
  {
    title: "Report & Analysis",
    href: "/dashboard/report",
    icon: DocumentChartBarIcon,
  },
  { title: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export const Sidebar = () => {
  const {
    pathname,
    isExpanded,
    isPinned,
    isMobileMenuOpen,
    closeMobileMenu,
    handleMouseEnter,
    handleMouseLeave,
    togglePinned,
  } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 bg-[#122e2c] transition-all duration-300 ease-in-out flex flex-col z-50 shadow-2xl overflow-visible w-64 md:hidden rounded-tr-[40px] rounded-br-[40px]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Navigation for Mobile */}
        <div className="flex-1 flex flex-col gap-3 px-3 py-10 overflow-y-auto custom-scrollbar overflow-x-hidden mt-16">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center gap-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 px-4",
                  isActive
                    ? "bg-[#183d3a] text-emerald-400"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r-md shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <span className="tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Desktop Spacer & Container */}
      <div
        className={cn(
          "hidden md:block  relative transition-all duration-300 ease-in-out shrink-0 self-stretch",
          isPinned ? "w-64" : "w-20",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <aside
          className={cn(
            "absolute top-20 md:top-0 inset-y-0 left-0 bg-[#122e2c] transition-all duration-300 ease-in-out flex flex-col z-50 shadow-2xl overflow-visible",
            "rounded-tr-[40px] rounded-br-[40px]",
            isExpanded || isPinned ? "w-64" : "w-20",
          )}
        >
          {/* Toggle Button */}
          <button
            onClick={togglePinned}
            className={cn(
              "absolute top-6 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-transform duration-300 z-50 hover:scale-110",
              "-right-3.5",
            )}
          >
            <ChevronRightIcon
              className={cn(
                "h-4 w-4 stroke-[3px] transition-transform duration-300",
                isExpanded || isPinned ? "rotate-180" : "rotate-0",
              )}
            />
          </button>

          {/* Navigation */}
          <div className="flex-1 flex flex-col gap-3 px-3 py-10 overflow-y-auto custom-scrollbar overflow-x-hidden">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 768) closeMobileMenu();
                  }}
                  className={cn(
                    "flex items-center gap-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative",
                    isActive
                      ? "bg-[#183d3a] text-emerald-400"
                      : "text-slate-300 hover:text-white hover:bg-white/5",
                    isExpanded || isPinned || isMobileMenuOpen
                      ? "px-4"
                      : "px-0 justify-center",
                  )}
                  title={
                    !isExpanded && !isPinned && !isMobileMenuOpen
                      ? item.title
                      : undefined
                  }
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-r-md shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                  )}

                  <div
                    className={cn(
                      "transition-transform duration-300 shrink-0 flex items-center justify-center",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-300 group-hover:text-emerald-400",
                      !isExpanded && !isPinned && !isMobileMenuOpen && "w-full",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {(isExpanded || isPinned || isMobileMenuOpen) && (
                    <span className="tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
};

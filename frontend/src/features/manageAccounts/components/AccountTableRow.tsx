"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { AccountTableRowProps } from "../types/manageAccount.type";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const BADGE_STYLES: Record<string, string> = {
  STORE_ADMIN: "bg-teal-50 text-teal-700 border-teal-100",
  SUPER_ADMIN: "bg-blue-50 text-blue-700 border-blue-100",
  CUSTOMER: "bg-purple-50 text-purple-700 border-purple-100",
  EMPLOYEE: "bg-slate-100 text-slate-600 border-slate-200",
};

export const AccountTableRow: React.FC<AccountTableRowProps> = ({
  account,
  index,
  onEdit,
  onDelete,
}) => {
  const isStoreAdmin = account.employee?.role === "STORE_ADMIN";
  const isCustomer = account.role === "CUSTOMER";
  const isSuperAdmin = account.employee?.role === "SUPER_ADMIN";

  // Only STORE_ADMIN rows get active edit/delete buttons
  const canEdit = isStoreAdmin;

  const roleKey = isCustomer
    ? "CUSTOMER"
    : (account.employee?.role ?? account.role);
  const badgeStyle = BADGE_STYLES[roleKey] ?? BADGE_STYLES.EMPLOYEE;
  const badgeLabel = isCustomer ? "CUSTOMER" : (account.employee?.role ?? account.role);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="hover:bg-[#e6e8ea]/30 transition-colors group"
    >
      {/* User */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#eff1f2] flex items-center justify-center overflow-hidden shrink-0">
            {account.avatar ? (
              <img
                src={account.avatar}
                alt={account.username ?? account.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-[#595c5d]" />
            )}
          </div>
          <div>
            <p className="font-medium text-[#2c2f30] text-sm">
              {account.username || account.email}
            </p>
            <p className="text-[#595c5d] text-xs">{account.email}</p>
          </div>
        </div>
      </td>

      {/* Role badge */}
      <td className="py-4 px-6">
        <Badge
          variant="secondary"
          className={`${badgeStyle} text-[10px] uppercase font-bold px-2 py-0`}
        >
          {badgeLabel}
        </Badge>
      </td>

      {/* Branch */}
      <td className="py-4 px-6 text-sm text-[#595c5d]">
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          {account.employee?.branch?.storeName ?? "—"}
        </div>
      </td>

      {/* Joined date */}
      <td className="py-4 px-6 text-sm text-[#595c5d]">
        {formatDate(account.createdAt)}
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-1">
          <motion.button
            whileHover={canEdit ? { scale: 1.12 } : {}}
            whileTap={canEdit ? { scale: 0.92 } : {}}
            onClick={() => canEdit && onEdit(account)}
            disabled={!canEdit}
            className={`p-1.5 rounded-md transition-colors ${
              canEdit
                ? "text-slate-400 hover:text-[#006666] hover:bg-[#87eded]/20 cursor-pointer"
                : "text-slate-200 cursor-not-allowed"
            }`}
            title={canEdit ? "Edit account" : "Not editable"}
          >
            <PencilSquareIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={canEdit ? { scale: 1.12 } : {}}
            whileTap={canEdit ? { scale: 0.92 } : {}}
            onClick={() => canEdit && onDelete(account)}
            disabled={!canEdit}
            className={`p-1.5 rounded-md transition-colors ${
              canEdit
                ? "text-slate-400 hover:text-[#b31b25] hover:bg-red-50 cursor-pointer"
                : "text-slate-200 cursor-not-allowed"
            }`}
            title={canEdit ? "Delete account" : "Not deletable"}
          >
            <TrashIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

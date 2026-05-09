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
import { MobileAccountCardProps } from "../types/manageAccount.type";

const BADGE_STYLES: Record<string, string> = {
  STORE_ADMIN: "bg-teal-50 text-teal-700 border-teal-100",
  SUPER_ADMIN: "bg-blue-50 text-blue-700 border-blue-100",
  CUSTOMER: "bg-purple-50 text-purple-700 border-purple-100",
  EMPLOYEE: "bg-slate-100 text-slate-600 border-slate-200",
};

export const AccountCard: React.FC<MobileAccountCardProps> = ({
  account,
  index,
  onEdit,
  onDelete,
}) => {
  const isStoreAdmin = account.employee?.role === "STORE_ADMIN";
  const isCustomer = account.role === "CUSTOMER";
  const canEdit = isStoreAdmin;

  const roleKey = isCustomer
    ? "CUSTOMER"
    : (account.employee?.role ?? account.role);
  const badgeStyle = BADGE_STYLES[roleKey] ?? BADGE_STYLES.EMPLOYEE;
  const badgeLabel = isCustomer ? "CUSTOMER" : (account.employee?.role ?? account.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-4 flex gap-4"
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-lg bg-[#eff1f2] flex items-center justify-center overflow-hidden shrink-0">
        {account.avatar ? (
          <img
            src={account.avatar}
            alt={account.username ?? account.email}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserIcon className="w-6 h-6 text-[#595c5d]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-[#2c2f30] text-sm truncate">
              {account.username || account.email}
            </p>
            <p className="text-xs text-[#595c5d] truncate">{account.email}</p>
          </div>

          {/* Action buttons — always shown, disabled for non-STORE_ADMIN */}
          <div className="flex items-center gap-1 shrink-0">
            <motion.button
              whileTap={canEdit ? { scale: 0.9 } : {}}
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
              whileTap={canEdit ? { scale: 0.9 } : {}}
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
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <Badge
            variant="secondary"
            className={`${badgeStyle} text-[10px] uppercase font-bold px-2 py-0`}
          >
            {badgeLabel}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-[#595c5d]">
            <MapPinIcon className="w-3 h-3 text-teal-600" />
            {account.employee?.branch?.storeName ?? "—"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

import React from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountTableRowProps } from "../types/manageAccount.type";

export const AccountTableRow: React.FC<AccountTableRowProps> = ({
  account,
  index,
  onEdit,
  onDelete,
}) => {
  const isStoreAdmin = account.employee?.role === "STORE_ADMIN";

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
      className="group hover:bg-slate-50 transition-colors"
    >
      <td className="py-4 px-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            {account.avatar ? (
              <img
                src={account.avatar}
                alt={account.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {account.employee?.fullName || account.username || "Unnamed User"}
            </div>
            <div className="text-xs text-slate-500">{account.email}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 border-b border-slate-100">
        <Badge
          variant={isStoreAdmin ? "default" : "secondary"}
          className={`${
            isStoreAdmin
              ? "bg-teal-50 text-teal-700 border-teal-100"
              : account.role === "EMPLOYEE"
                ? "bg-blue-50 text-blue-700 border-blue-100"
                : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          {account.employee?.role || account.role}
        </Badge>
      </td>
      <td className="py-4 px-6 border-b border-slate-100 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <MapPinIcon className="w-3.5 h-3.5 text-teal-600" />
          {account.employee?.branch?.storeName || "-"}
        </div>
      </td>
      <td className="py-4 px-6 border-b border-slate-100 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isStoreAdmin && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(account)}
                className="w-8 h-8 text-slate-400 hover:text-teal-600 hover:bg-teal-50"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(account)}
                className="w-8 h-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

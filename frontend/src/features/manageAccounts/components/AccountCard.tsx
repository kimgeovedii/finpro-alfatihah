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
import { MobileAccountCardProps } from "../types/manageAccount.type";

export const AccountCard: React.FC<MobileAccountCardProps> = ({
  account,
  index,
  onEdit,
  onDelete,
}) => {
  const isStoreAdmin = account.employee?.role === "STORE_ADMIN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="md:hidden bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
            {account.avatar ? (
              <img
                src={account.avatar}
                alt={account.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">
              {account.employee?.fullName || account.username || "Unnamed User"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{account.email}</p>
          </div>
        </div>
        <Badge
          variant={isStoreAdmin ? "default" : "secondary"}
          className={`${
            isStoreAdmin
              ? "bg-teal-50 text-teal-700 border-teal-100"
              : account.role === "EMPLOYEE"
                ? "bg-blue-50 text-blue-700 border-blue-100"
                : "bg-slate-100 text-slate-600 border-slate-200"
          } px-2 py-0 text-[10px] uppercase font-bold`}
        >
          {account.employee?.role || account.role}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
        <MapPinIcon className="w-4 h-4 text-teal-600" />
        <span className="text-sm font-medium">
          {account.employee?.branch?.storeName || "No Branch Assigned"}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {isStoreAdmin && (
          <>
            <Button
              onClick={() => onEdit(account)}
              className="flex-1 h-10 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100"
            >
              <PencilSquareIcon className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() => onDelete(account)}
              className="h-10 w-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 p-0"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
    </motion.div>
  );
};

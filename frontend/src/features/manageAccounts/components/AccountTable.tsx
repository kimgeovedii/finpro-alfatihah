import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccountTableProps } from "../types/manageAccount.type";
import { AccountTableRow } from "./AccountTableRow";

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  isLoading,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff1f2] text-[#595c5d] text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-medium">User</th>
              <th className="py-4 px-6 font-medium">Role</th>
              <th className="py-4 px-6 font-medium">Assigned Branch</th>
              <th className="py-4 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff1f2]/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="py-8 px-6 text-center">
                    <div className="h-12 bg-slate-50 rounded-lg w-full" />
                  </td>
                </tr>
              ))
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-slate-400">
                  No accounts found.
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {accounts.map((account, index) => (
                  <AccountTableRow
                    key={account.id}
                    account={account}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

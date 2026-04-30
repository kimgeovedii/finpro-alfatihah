import { currencyFormat } from "@/constants/business.const";
import { IDiscount } from "../types/discount.type";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface DiscountTableProps {
  discounts: IDiscount[];
  onEdit: (discount: IDiscount) => void;
  onDelete: (discount: IDiscount) => void;
}

export const DiscountTable = ({
  discounts,
  onEdit,
  onDelete,
}: DiscountTableProps) => {
  const getStatus = (status: "SCHEDULED" | "ACTIVE" | "EXPIRED") => {
    if (status === "SCHEDULED") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          <span className="text-[10px] font-bold text-amber-600 uppercase">
            Scheduled
          </span>
        </div>
      );
    } else if (status === "ACTIVE") {
      return (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase">
            Active
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-700"></div>
          <span className="text-[10px] font-bold text-red-700 uppercase">
            Expired
          </span>
        </div>
      );
    }
  };

  const getDiscountTypeLabel = (type: string) => {
    switch (type) {
      case "PRODUCT_DISCOUNT":
        return "Direct Markdown";
      case "BUY_ONE_GET_ONE_FREE":
        return "Buy 1 Get 1 Promotion";
      case "MINIMUM_PURCHASE":
        return "Minimum Purchase";
      default:
        return type;
    }
  };

  const getValueBadge = (discount: IDiscount) => {
    if (discount.discountType === "BUY_ONE_GET_ONE_FREE") {
      return (
        <span className="px-2 py-0.5 bg-teal-700 text-white rounded-full text-[10px] font-black uppercase whitespace-nowrap">
          B1G1
        </span>
      );
    }

    if (discount.discountValueType === "PERCENTAGE") {
      return (
        <span className="px-2 py-0.5 bg-orange-200 text-orange-900 rounded-full text-[10px] font-black whitespace-nowrap">
          {discount.discountValue}% OFF
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-[10px] font-black whitespace-nowrap">
          Rp {discount.discountValue.toLocaleString(currencyFormat)}
        </span>
      );
    }
  };

  return (
    <div className="overflow-x-auto w-full max-w-full">
      <table className="w-full text-left border-collapse min-w-[1100px]">
        <thead>
          <tr className="text-slate-500 border-b border-slate-200">
            <th className="px-6 py-4 font-label text-[11px] uppercase tracking-widest">
              Name & Type
            </th>
            <th className="px-4 py-4 font-label text-[11px] uppercase tracking-widest">
              Status
            </th>
            <th className="px-4 py-4 font-label text-[11px] uppercase tracking-widest">
              Value
            </th>
            <th className="px-4 py-4 font-label text-[11px] uppercase tracking-widest">
              Quota
            </th>
            <th className="px-4 py-4 font-label text-[11px] uppercase tracking-widest">
              Validity
            </th>
            <th className="px-4 py-4 font-label text-[11px] uppercase tracking-widest">
              Branches
            </th>
            <th className="px-4 py-4 font-label text-[11px] uppercase tracking-widest">
              Applied Products
            </th>
            <th className="px-6 py-4 font-label text-[11px] uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {discounts.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-10 text-slate-500">
                No discounts found.
              </td>
            </tr>
          ) : (
            discounts.map((discount, index) => (
              <motion.tr
                key={discount.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-6 py-6">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      {discount.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {getDiscountTypeLabel(discount.discountType)}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-6">{getStatus(discount.status)}</td>
                <td className="px-4 py-6">{getValueBadge(discount)}</td>
                <td className="px-4 py-6">
                  <span className="text-xs font-medium text-slate-800">
                    {discount.quota} left
                  </span>
                </td>
                <td className="px-4 py-6">
                  <div className="text-[11px] leading-tight">
                    <p className="text-slate-800 font-semibold">
                      {new Date(discount.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-slate-500">
                      {new Date(discount.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-6">
                  <span className="text-xs text-slate-800">
                    {discount.branch?.storeName || "All Branches"}
                  </span>
                </td>
                <td className="px-4 py-6">
                  {discount.productDiscounts &&
                  discount.productDiscounts.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-medium">
                        {discount.productDiscounts[0].product?.productName ||
                          "Product"}
                      </span>
                      {discount.productDiscounts.length > 1 && (
                        <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-medium">
                          +{discount.productDiscounts.length - 1} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs italic text-slate-400">None</span>
                  )}
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onEdit(discount)}
                      className="p-1.5 text-slate-400 hover:text-[#006666] transition-colors rounded-md hover:bg-[#87eded]/20 cursor-pointer"
                      title="Edit discount"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onDelete(discount)}
                      className="p-1.5 text-slate-400 hover:text-[#b31b25] transition-colors rounded-md hover:bg-red-50 cursor-pointer"
                      title="Delete discount"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

import { IDiscount, DiscountTableProps } from "../types/discount.type";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DiscountTable = ({
  discounts,
  onEdit,
  onDelete,
  canManage = true,
  sortBy,
  sortOrder,
  onSort,
}: DiscountTableProps) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUpIcon className="w-3 h-3" />
    ) : (
      <ChevronDownIcon className="w-3 h-3" />
    );
  };
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
          Rp {discount.discountValue.toLocaleString()}
        </span>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full overflow-x-auto"
    >
      <div className="min-w-[1100px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff1f2] text-[#595c5d] text-xs uppercase tracking-wider">
              <th
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center gap-1.5">
                  Name & Type <SortIcon field="name" />
                </div>
              </th>
              <th className="py-4 px-6 font-medium">
                Status
              </th>
              <th className="py-4 px-6 font-medium">
                Value
              </th>
              <th
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors"
                onClick={() => onSort("quota")}
              >
                <div className="flex items-center gap-1.5">
                  Quota <SortIcon field="quota" />
                </div>
              </th>
              <th
                className="py-4 px-6 font-medium cursor-pointer hover:text-[#006666] transition-colors"
                onClick={() => onSort("startDate")}
              >
                <div className="flex items-center gap-1.5">
                  Validity <SortIcon field="startDate" />
                </div>
              </th>
              <th className="py-4 px-6 font-medium">
                Branches
              </th>
              <th className="py-4 px-6 font-medium">
                Applied Products
              </th>
              {canManage && (
                <th className="py-4 px-6 font-medium text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eff1f2]/50">
            {discounts.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="text-center py-10 text-[#595c5d] text-sm">
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
                  className="hover:bg-[#e6e8ea]/30 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-[#2c2f30] text-sm">
                        {discount.name}
                      </p>
                      <p className="text-xs text-[#595c5d]">
                        {getDiscountTypeLabel(discount.discountType)}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getStatus(discount.status)}</td>
                  <td className="py-4 px-6">{getValueBadge(discount)}</td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-[#2c2f30]">
                      {discount.quota} left
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-xs leading-tight">
                      <p className="text-[#2c2f30] font-medium">
                        {new Date(discount.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-[#595c5d]">
                        {new Date(discount.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-[#595c5d]">
                      {discount.branch?.storeName || "All Branches"}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {discount.productDiscounts &&
                    discount.productDiscounts.length > 0 ? (
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="px-2 py-0.5 bg-[#eff1f2] rounded-full text-[10px] font-medium text-[#2c2f30]">
                          {discount.productDiscounts[0].product?.productName ||
                            "Product"}
                        </span>
                        {discount.productDiscounts.length > 1 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="px-2 py-0.5 bg-[#006666]/10 text-[#006666] rounded-full text-[10px] font-bold hover:bg-[#006666]/20 transition-colors cursor-pointer">
                                +{discount.productDiscounts.length - 1} more
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-3 bg-white rounded-xl shadow-xl border border-[#eff1f2]">
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-[#595c5d] uppercase tracking-wider mb-2">
                                  Applied Products ({discount.productDiscounts.length})
                                </p>
                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                                  {discount.productDiscounts.map((pd) => (
                                    <div 
                                      key={pd.id}
                                      className="text-xs py-1.5 px-2 hover:bg-[#eff1f2] rounded-lg text-[#2c2f30] transition-colors"
                                    >
                                      {pd.product?.productName}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs italic text-[#595c5d]/50">None</span>
                    )}
                  </td>
                  {canManage && (
                    <td className="py-4 px-6 text-right">
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
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
